const db = require('../config/db');

// Helper to safely parse specifications
const parseSpecs = (specifications) => {
  if (!specifications) return {};
  if (typeof specifications === 'object') return specifications;
  try {
    return JSON.parse(specifications);
  } catch (e) {
    return specifications;
  }
};

// @desc    Get all products with optional filters
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  const { category, search, limit } = req.query;

  try {
    let sql = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND (p.category_id = ? OR c.name = ?)';
      params.push(category, category);
    }

    if (search) {
      sql += ' AND p.name LIKE ?';
      params.push(`%${search}%`);
    }

    // Sort by created date or standard
    sql += ' ORDER BY p.id ASC';

    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const [products] = await db.query(sql, params);

    // Get primary images for each product
    const [allImages] = await db.query('SELECT * FROM product_images');

    const productsWithImages = products.map(product => {
      const images = allImages.filter(img => img.product_id === product.id);
      const primaryImage = images.find(img => img.is_primary === 1) || images[0];
      return {
        ...product,
        specifications: parseSpecs(product.specifications),
        image_url: primaryImage ? primaryImage.image_url : '',
        images: images.map(img => img.image_url)
      };
    });

    res.status(200).json({ products: productsWithImages });
  } catch (err) {
    console.error("Get All Products Error:", err);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    // Fetch all images for this product
    const [images] = await db.query('SELECT * FROM product_images WHERE product_id = ?', [productId]);

    // Fetch category name
    const [categories] = await db.query('SELECT name FROM categories WHERE id = ?', [product.category_id]);
    const categoryName = categories.length > 0 ? categories[0].name : '';

    const productDetails = {
      ...product,
      category_name: categoryName,
      specifications: parseSpecs(product.specifications),
      images: images.map(img => img.image_url),
      image_url: (images.find(img => img.is_primary === 1) || images[0] || {}).image_url || ''
    };

    res.status(200).json({ product: productDetails });
  } catch (err) {
    console.error("Get Product By ID Error:", err);
    res.status(500).json({ message: 'Server error fetching product details' });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ message: 'Search query parameter is required' });
  }

  try {
    const [products] = await db.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.name LIKE ?',
      [`%${query}%`]
    );

    const [allImages] = await db.query('SELECT * FROM product_images');

    const productsWithImages = products.map(product => {
      const images = allImages.filter(img => img.product_id === product.id);
      const primaryImage = images.find(img => img.is_primary === 1) || images[0];
      return {
        ...product,
        specifications: parseSpecs(product.specifications),
        image_url: primaryImage ? primaryImage.image_url : '',
        images: images.map(img => img.image_url)
      };
    });

    res.status(200).json({ products: productsWithImages });
  } catch (err) {
    console.error("Search Products Error:", err);
    res.status(500).json({ message: 'Server error searching products' });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  const categoryName = req.params.category;

  try {
    const [products] = await db.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE c.name = ?',
      [categoryName]
    );

    const [allImages] = await db.query('SELECT * FROM product_images');

    const productsWithImages = products.map(product => {
      const images = allImages.filter(img => img.product_id === product.id);
      const primaryImage = images.find(img => img.is_primary === 1) || images[0];
      return {
        ...product,
        specifications: parseSpecs(product.specifications),
        image_url: primaryImage ? primaryImage.image_url : '',
        images: images.map(img => img.image_url)
      };
    });

    res.status(200).json({ products: productsWithImages });
  } catch (err) {
    console.error("Get Products By Category Error:", err);
    res.status(500).json({ message: 'Server error fetching products by category' });
  }
};

// @desc    Get all categories list
// @route   GET /api/products/categories/list
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.status(200).json({ categories });
  } catch (err) {
    console.error("Get Categories Error:", err);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};
