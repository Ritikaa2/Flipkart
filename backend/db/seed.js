const db = require('../config/db');
const seedData = require('./seedData');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  console.log("Seeding database...");

  if (db.isOfflineMode()) {
    console.log("Local JSON database is ready.");
    process.exit(0);
  }

  try {
    console.log("Clearing old MySQL data...");
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("TRUNCATE TABLE wishlist");
    await db.query("TRUNCATE TABLE cart_items");
    await db.query("TRUNCATE TABLE order_items");
    await db.query("TRUNCATE TABLE orders");
    await db.query("TRUNCATE TABLE product_images");
    await db.query("TRUNCATE TABLE products");
    await db.query("TRUNCATE TABLE categories");
    await db.query("TRUNCATE TABLE users");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");

    for (const cat of seedData.categories) {
      await db.query("INSERT INTO categories (id, name, image_url) VALUES (?, ?, ?)", [
        cat.id, cat.name, cat.image_url
      ]);
    }
    let imageInsertCount = 0;
    for (const prod of seedData.products) {
      await db.query(
        "INSERT INTO products (id, category_id, name, price, mrp, rating, rating_count, review_count, description, specifications, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          prod.id,
          prod.category_id,
          prod.name,
          prod.price,
          prod.mrp,
          prod.rating,
          prod.rating_count,
          prod.review_count,
          prod.description,
          JSON.stringify(prod.specifications),
          prod.stock
        ]
      );

      if (prod.images && prod.images.length > 0) {
        for (let i = 0; i < prod.images.length; i++) {
          const imgUrl = prod.images[i];
          const isPrimary = i === 0 ? 1 : 0;
          await db.query(
            "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)",
            [prod.id, imgUrl, isPrimary]
          );
          imageInsertCount++;
        }
      }
    }
    console.log(`Inserted ${seedData.categories.length} categories, ${seedData.products.length} products and ${imageInsertCount} images.`);

    const demoPassword = await bcrypt.hash("demo12345", 10);
    await db.query(
      "INSERT INTO users (id, name, email, password, phone, address) VALUES (?, ?, ?, ?, ?, ?)",
      [
        1,
        "Demo User",
        "demo@flipkart.com",
        demoPassword,
        "9876543210",
        "123, Flipkart Street, Tech Park, Bangalore, Karnataka - 560001"
      ]
    );
    console.log("Demo user: demo@flipkart.com / demo12345");
    console.log("Database seeded.");
    process.exit(0);
  } catch (error) {
    console.error("Error during MySQL database seeding:", error);
    process.exit(1);
  }
}

seedDatabase();
