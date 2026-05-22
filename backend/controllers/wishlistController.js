const db = require('../config/db');

// @desc    Get user wishlist items
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const [wishlistItems] = await db.query(
      `SELECT w.*, p.name, p.price, p.mrp, p.rating, p.rating_count, p.review_count, p.stock FROM wishlist w
       INNER JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?`,
      [userId]
    );

    // Fetch primary images for these products
    const [images] = await db.query('SELECT * FROM product_images WHERE is_primary = 1');

    const wishlistWithImages = wishlistItems.map(item => {
      const img = images.find(i => i.product_id === item.product_id);
      return {
        ...item,
        image_url: img ? img.image_url : ''
      };
    });

    res.status(200).json({ wishlist: wishlistWithImages });
  } catch (err) {
    console.error("Get Wishlist Error:", err);
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    // Check if product exists in wishlist already
    const [existing] = await db.query(
      'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Insert new item
    const [result] = await db.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userId, product_id]
    );

    res.status(201).json({ message: 'Product added to wishlist', wishlistId: result.insertId });
  } catch (err) {
    console.error("Add To Wishlist Error:", err);
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  try {
    const [result] = await db.query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    res.status(200).json({ message: 'Product removed from wishlist successfully' });
  } catch (err) {
    console.error("Remove Wishlist Item Error:", err);
    res.status(500).json({ message: 'Server error removing wishlist item' });
  }
};
