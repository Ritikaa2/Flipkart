const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const useMySQL = true;
let pool = null;
let isFallback = false;

// Mock database file path
const mockDbPath = path.join(__dirname, '../db/mock_db.json');

// Initialize local JSON DB if it doesn't exist
function initMockDb() {
  if (!fs.existsSync(mockDbPath)) {
    const seedData = require('../db/seedData');
    const dbState = {
      users: [],
      categories: seedData.categories,
      products: seedData.products.map(p => {
        const { images, ...prodWithoutImages } = p;
        return prodWithoutImages;
      }),
      product_images: [],
      cart_items: [],
      wishlist: [],
      orders: [],
      order_items: []
    };

    // Flatten product images into relational product_images table
    let imgId = 1;
    seedData.products.forEach(p => {
      if (p.images && p.images.length > 0) {
        p.images.forEach((img, idx) => {
          dbState.product_images.push({
            id: imgId++,
            product_id: p.id,
            image_url: img,
            is_primary: idx === 0 ? 1 : 0
          });
        });
      }
    });

    // Create db folder if not exists
    const dbDir = path.dirname(mockDbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    fs.writeFileSync(mockDbPath, JSON.stringify(dbState, null, 2), 'utf8');
    console.log("Mock database initialized successfully in JSON format at " + mockDbPath);
  } else {
    syncMockSeed();
  }
}

function syncMockSeed() {
  const seedData = require('../db/seedData');
  let state;
  try {
    state = JSON.parse(fs.readFileSync(mockDbPath, 'utf8'));
  } catch {
    return;
  }

  state.categories = state.categories || [];
  state.products = state.products || [];
  state.product_images = state.product_images || [];
  state.orders = (state.orders || []).map((order) => ({
    ...order,
    order_number: order.order_number || `FK-${order.id}`
  }));

  const categoryIds = new Set(state.categories.map((category) => Number(category.id)));
  seedData.categories.forEach((category) => {
    if (!categoryIds.has(Number(category.id))) state.categories.push(category);
  });

  const productIds = new Set(state.products.map((product) => Number(product.id)));
  seedData.products.forEach((product) => {
    if (productIds.has(Number(product.id))) return;
    const { images, ...productWithoutImages } = product;
    state.products.push(productWithoutImages);

    const nextImageId = () => state.product_images.length > 0
      ? Math.max(...state.product_images.map((image) => Number(image.id) || 0)) + 1
      : 1;

    (images || []).forEach((imageUrl, index) => {
      state.product_images.push({
        id: nextImageId(),
        product_id: product.id,
        image_url: imageUrl,
        is_primary: index === 0 ? 1 : 0
      });
    });
  });

  writeMockDb(state);
}

// Load current mock DB state
function readMockDb() {
  initMockDb();
  try {
    const data = fs.readFileSync(mockDbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading Mock DB, resetting state:", error);
    return {
      users: [], categories: [], products: [], product_images: [],
      cart_items: [], wishlist: [], orders: [], order_items: []
    };
  }
}

// Save mock DB state
function writeMockDb(state) {
  fs.writeFileSync(mockDbPath, JSON.stringify(state, null, 2), 'utf8');
}

// Attempt to create a MySQL pool
async function initDatabase() {
  try {
    console.log(`Attempting to connect to MySQL database '${process.env.DB_NAME}' on ${process.env.DB_HOST}:${process.env.DB_PORT}...`);
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
      database: process.env.DB_NAME || 'flipkart',
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test the connection
    const connection = await pool.getConnection();
    console.log("Successfully connected to MySQL database!");
    connection.release();
    try {
      await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_status VARCHAR(50) DEFAULT 'Placed'");
      await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(32) UNIQUE");
      await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_status VARCHAR(50) DEFAULT 'Not requested'");
      await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_reason VARCHAR(255)");
      await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP NULL");
      await syncSeedToMySQL();
    } catch (schemaErr) {
      console.warn("Order lifecycle columns could not be auto-created:", schemaErr.message);
    }
    isFallback = false;
  } catch (err) {
    console.warn("==========================================================================");
    console.warn("WARNING: Could not connect to MySQL database.");
    console.warn("Error message:", err.message);
    console.warn("FALLING BACK: Operating in offline local-JSON mode!");
    console.warn("Database actions will read/write to: backend/db/mock_db.json");
    console.warn("==========================================================================");
    isFallback = true;
    initMockDb();
  }
}

async function syncSeedToMySQL() {
  const seedData = require('../db/seedData');

  for (const category of seedData.categories) {
    await pool.query(
      "INSERT IGNORE INTO categories (id, name, image_url) VALUES (?, ?, ?)",
      [category.id, category.name, category.image_url]
    );
  }

  for (const product of seedData.products) {
    const [existingProducts] = await pool.query("SELECT id FROM products WHERE id = ?", [product.id]);
    if (!existingProducts.length) {
      await pool.query(
        "INSERT INTO products (id, category_id, name, price, mrp, rating, rating_count, review_count, description, specifications, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          product.id,
          product.category_id,
          product.name,
          product.price,
          product.mrp,
          product.rating,
          product.rating_count,
          product.review_count,
          product.description,
          JSON.stringify(product.specifications),
          product.stock
        ]
      );
    }

    const [existingImages] = await pool.query("SELECT id FROM product_images WHERE product_id = ?", [product.id]);
    if (!existingImages.length) {
      for (let index = 0; index < (product.images || []).length; index++) {
        await pool.query(
          "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)",
          [product.id, product.images[index], index === 0 ? 1 : 0]
        );
      }
    }
  }
}

// Immediately run the DB initializer
initDatabase();

// Lightweight SQL-like Query Interpreter for JSON Mock DB
function executeMockQuery(sql, params = []) {
  const state = readMockDb();
  const sqlNormalized = sql.trim().replace(/\s+/g, ' ');

  // 1. SELECT USERS
  if (sqlNormalized.startsWith('SELECT * FROM users WHERE email = ?')) {
    const user = state.users.find(u => u.email === params[0]);
    return [user ? [user] : []];
  }
  if (sqlNormalized.startsWith('SELECT * FROM users WHERE id = ?')) {
    const user = state.users.find(u => u.id === params[0]);
    return [user ? [user] : []];
  }

  // 2. INSERT USER
  if (sqlNormalized.startsWith('INSERT INTO users')) {
    const id = state.users.length > 0 ? Math.max(...state.users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id,
      name: params[0],
      email: params[1],
      password: params[2],
      phone: params[3],
      address: params[4],
      created_at: new Date().toISOString()
    };
    state.users.push(newUser);
    writeMockDb(state);
    return [{ insertId: id }];
  }
  if (sqlNormalized.startsWith('UPDATE users SET password = ? WHERE email = ?')) {
    const idx = state.users.findIndex(u => u.email === params[1]);
    if (idx !== -1) {
      state.users[idx].password = params[0];
      writeMockDb(state);
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  // 3. SELECT CATEGORIES
  if (sqlNormalized.startsWith('SELECT * FROM categories')) {
    return [state.categories];
  }

  // 4. SELECT PRODUCTS
  if (sqlNormalized.startsWith('SELECT p.*, c.name as category_name FROM products p')) {
    // Joining category name
    let result = state.products.map(p => {
      const cat = state.categories.find(c => c.id === p.category_id);
      return { ...p, category_name: cat ? cat.name : null };
    });

    // Check filters
    if (sqlNormalized.includes('WHERE p.category_id = ?')) {
      result = result.filter(p => p.category_id === parseInt(params[0]));
    } else if (sqlNormalized.includes('WHERE c.name = ?')) {
      const catName = params[0];
      const cat = state.categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
      const catId = cat ? cat.id : -1;
      result = result.filter(p => p.category_id === catId);
    }

    if (sqlNormalized.includes('WHERE p.name LIKE ?')) {
      const query = params[0].replace(/%/g, '').toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    return [result];
  }

  if (sqlNormalized.startsWith('SELECT * FROM products WHERE id = ?')) {
    const product = state.products.find(p => p.id === parseInt(params[0]));
    return [product ? [product] : []];
  }

  // 5. SELECT PRODUCT IMAGES
  if (sqlNormalized.startsWith('SELECT * FROM product_images WHERE product_id = ?')) {
    const images = state.product_images.filter(img => img.product_id === parseInt(params[0]));
    return [images];
  }
  if (sqlNormalized.startsWith('SELECT * FROM product_images')) {
    return [state.product_images];
  }

  // 6. CART ITEMS
  if (sqlNormalized.startsWith('SELECT c.*, p.name, p.price, p.mrp, p.stock FROM cart_items c')) {
    // Join cart with product and get their primary image
    const userId = parseInt(params[0]);
    const userCart = state.cart_items.filter(item => item.user_id === userId);
    const joined = userCart.map(item => {
      const p = state.products.find(prod => prod.id === item.product_id);
      const primaryImg = state.product_images.find(img => img.product_id === item.product_id && img.is_primary === 1);
      return {
        ...item,
        name: p ? p.name : 'Unknown Product',
        price: p ? p.price : 0,
        mrp: p ? p.mrp : 0,
        stock: p ? p.stock : 0,
        image_url: primaryImg ? primaryImg.image_url : (p ? '/favicon.svg' : '')
      };
    });
    return [joined];
  }
  if (sqlNormalized.startsWith('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?')) {
    const userId = parseInt(params[0]);
    const prodId = parseInt(params[1]);
    const item = state.cart_items.find(c => c.user_id === userId && c.product_id === prodId);
    return [item ? [item] : []];
  }
  if (sqlNormalized.startsWith('INSERT INTO cart_items')) {
    const id = state.cart_items.length > 0 ? Math.max(...state.cart_items.map(c => c.id)) + 1 : 1;
    const newItem = {
      id,
      user_id: parseInt(params[0]),
      product_id: parseInt(params[1]),
      quantity: parseInt(params[2] || 1)
    };
    state.cart_items.push(newItem);
    writeMockDb(state);
    return [{ insertId: id }];
  }
  if (sqlNormalized.startsWith('UPDATE cart_items SET quantity = ? WHERE id = ?')) {
    const quantity = parseInt(params[0]);
    const id = parseInt(params[1]);
    const idx = state.cart_items.findIndex(c => c.id === id);
    if (idx !== -1) {
      state.cart_items[idx].quantity = quantity;
      writeMockDb(state);
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }
  if (sqlNormalized.startsWith('DELETE FROM cart_items WHERE id = ?')) {
    const id = parseInt(params[0]);
    const initialLen = state.cart_items.length;
    state.cart_items = state.cart_items.filter(c => c.id !== id);
    writeMockDb(state);
    return [{ affectedRows: initialLen - state.cart_items.length }];
  }
  if (sqlNormalized.startsWith('DELETE FROM cart_items WHERE user_id = ?')) {
    const userId = parseInt(params[0]);
    state.cart_items = state.cart_items.filter(c => c.user_id !== userId);
    writeMockDb(state);
    return [{ affectedRows: 1 }];
  }

  // 7. WISHLIST
  if (sqlNormalized.startsWith('SELECT w.*, p.name, p.price, p.mrp, p.rating, p.rating_count, p.review_count FROM wishlist w')) {
    const userId = parseInt(params[0]);
    const userWish = state.wishlist.filter(item => item.user_id === userId);
    const joined = userWish.map(item => {
      const p = state.products.find(prod => prod.id === item.product_id);
      const primaryImg = state.product_images.find(img => img.product_id === item.product_id && img.is_primary === 1);
      return {
        ...item,
        name: p ? p.name : 'Unknown Product',
        price: p ? p.price : 0,
        mrp: p ? p.mrp : 0,
        rating: p ? p.rating : 0,
        rating_count: p ? p.rating_count : 0,
        review_count: p ? p.review_count : 0,
        image_url: primaryImg ? primaryImg.image_url : (p ? '/favicon.svg' : '')
      };
    });
    return [joined];
  }
  if (sqlNormalized.startsWith('SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?')) {
    const userId = parseInt(params[0]);
    const prodId = parseInt(params[1]);
    const item = state.wishlist.find(w => w.user_id === userId && w.product_id === prodId);
    return [item ? [item] : []];
  }
  if (sqlNormalized.startsWith('INSERT INTO wishlist')) {
    const id = state.wishlist.length > 0 ? Math.max(...state.wishlist.map(w => w.id)) + 1 : 1;
    const newItem = {
      id,
      user_id: parseInt(params[0]),
      product_id: parseInt(params[1]),
      created_at: new Date().toISOString()
    };
    state.wishlist.push(newItem);
    writeMockDb(state);
    return [{ insertId: id }];
  }
  if (sqlNormalized.startsWith('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?')) {
    const userId = parseInt(params[0]);
    const prodId = parseInt(params[1]);
    const initialLen = state.wishlist.length;
    state.wishlist = state.wishlist.filter(w => !(w.user_id === userId && w.product_id === prodId));
    writeMockDb(state);
    return [{ affectedRows: initialLen - state.wishlist.length }];
  }

  // 8. ORDERS
  if (sqlNormalized.startsWith('INSERT INTO orders')) {
    const id = state.orders.length > 0 ? Math.max(...state.orders.map(o => o.id)) + 1 : 1;
    const newOrder = {
      id,
      order_number: params.length === 11 ? params[0] : `FK-${id}`,
      user_id: parseInt(params.length === 11 ? params[1] : params[0]),
      total_mrp: parseFloat(params.length === 11 ? params[2] : params[1]),
      total_discount: parseFloat(params.length === 11 ? params[3] : params[2]),
      delivery_charges: parseFloat(params.length === 11 ? params[4] : params[3]),
      final_amount: parseFloat(params.length === 11 ? params[5] : params[4]),
      shipping_name: params.length === 11 ? params[6] : params[5],
      shipping_phone: params.length === 11 ? params[7] : params[6],
      shipping_address: params.length === 11 ? params[8] : params[7],
      payment_status: (params.length === 11 ? params[9] : params[8]) || 'Paid',
      payment_method: (params.length === 11 ? params[10] : params[9]) || 'Card',
      order_status: 'Placed',
      refund_status: 'Not requested',
      cancel_reason: null,
      cancelled_at: null,
      created_at: new Date().toISOString()
    };
    state.orders.push(newOrder);
    writeMockDb(state);
    return [{ insertId: id }];
  }
  if (sqlNormalized.startsWith('INSERT INTO order_items')) {
    const id = state.order_items.length > 0 ? Math.max(...state.order_items.map(oi => oi.id)) + 1 : 1;
    const newItem = {
      id,
      order_id: parseInt(params[0]),
      product_id: parseInt(params[1]),
      quantity: parseInt(params[2]),
      price: parseFloat(params[3])
    };
    state.order_items.push(newItem);
    writeMockDb(state);
    return [{ insertId: id }];
  }
  if (sqlNormalized.startsWith('SELECT * FROM orders WHERE user_id = ?')) {
    const userId = parseInt(params[0]);
    const orders = state.orders.filter(o => o.user_id === userId);
    // Sort descending by ID/date
    orders.sort((a, b) => b.id - a.id);
    return [orders];
  }
  if (sqlNormalized.startsWith('SELECT * FROM orders WHERE id = ?')) {
    const orderId = parseInt(params[0]);
    const order = state.orders.find(o => o.id === orderId);
    return [order ? [order] : []];
  }
  if (sqlNormalized.startsWith('UPDATE orders SET order_status = ?')) {
    const orderId = parseInt(params[5]);
    const userId = parseInt(params[6]);
    const idx = state.orders.findIndex(o => o.id === orderId && o.user_id === userId);
    if (idx !== -1) {
      state.orders[idx] = {
        ...state.orders[idx],
        order_status: params[0],
        payment_status: params[1],
        refund_status: params[2],
        cancel_reason: params[3],
        cancelled_at: params[4]
      };
      writeMockDb(state);
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }
  if (sqlNormalized.startsWith('SELECT oi.*, p.name, p.price as current_price FROM order_items oi')) {
    const orderId = parseInt(params[0]);
    const items = state.order_items.filter(oi => oi.order_id === orderId);
    const joined = items.map(item => {
      const p = state.products.find(prod => prod.id === item.product_id);
      const primaryImg = state.product_images.find(img => img.product_id === item.product_id && img.is_primary === 1);
      return {
        ...item,
        name: p ? p.name : 'Unknown Product',
        current_price: p ? p.price : 0,
        image_url: primaryImg ? primaryImg.image_url : ''
      };
    });
    return [joined];
  }

  // 9. PRODUCT STOCK UPDATE
  if (sqlNormalized.startsWith('UPDATE products SET stock = stock - ? WHERE id = ?')) {
    const qty = parseInt(params[0]);
    const id = parseInt(params[1]);
    const idx = state.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      state.products[idx].stock = Math.max(0, state.products[idx].stock - qty);
      writeMockDb(state);
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }
  if (sqlNormalized.startsWith('UPDATE products SET stock = stock + ? WHERE id = ?')) {
    const qty = parseInt(params[0]);
    const id = parseInt(params[1]);
    const idx = state.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      state.products[idx].stock = parseInt(state.products[idx].stock || 0) + qty;
      writeMockDb(state);
      return [{ affectedRows: 1 }];
    }
    return [{ affectedRows: 0 }];
  }

  console.warn("Unmatched Mock SQL Query:", sqlNormalized, params);
  return [[]];
}

// Public API
module.exports = {
  query: async function (sql, params = []) {
    if (isFallback || !pool) {
      return executeMockQuery(sql, params);
    }
    try {
      return await pool.query(sql, params);
    } catch (err) {
      console.error("MySQL query failed, falling back to mock query processor:", err.message);
      return executeMockQuery(sql, params);
    }
  },
  isOfflineMode: function() {
    return isFallback;
  }
};
