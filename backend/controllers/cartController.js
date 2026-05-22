const db = require('../config/db');

// @desc    Get cart items for a user
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const [cartItems] = await db.query(
      `SELECT c.*, p.name, p.price, p.mrp, p.stock FROM cart_items c 
       INNER JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    // Fetch primary images for these products
    const [images] = await db.query('SELECT * FROM product_images WHERE is_primary = 1');

    const cartWithImages = cartItems.map(item => {
      const img = images.find(i => i.product_id === item.product_id);
      return {
        ...item,
        image_url: img ? img.image_url : ''
      };
    });

    res.status(200).json({ cart: cartWithImages });
  } catch (err) {
    console.error("Get Cart Error:", err);
    res.status(500).json({ message: 'Server error fetching cart items' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  if (!product_id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  const qty = parseInt(quantity || 1);

  try {
    // Check if item already exists in user's cart
    const [existing] = await db.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existing.length > 0) {
      // Update quantity
      const newQty = existing[0].quantity + qty;
      await db.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQty, existing[0].id]
      );
      return res.status(200).json({ message: 'Cart item quantity updated', cartItemId: existing[0].id });
    }

    // Insert new item
    const [result] = await db.query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, product_id, qty]
    );

    res.status(201).json({ message: 'Product added to cart', cartItemId: result.insertId });
  } catch (err) {
    console.error("Add To Cart Error:", err);
    res.status(500).json({ message: 'Server error adding item to cart' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:cartItemId
// @access  Private
exports.updateQuantity = async (req, res) => {
  const cartItemId = req.params.cartItemId;
  const { quantity } = req.body;

  if (quantity === undefined || parseInt(quantity) < 1) {
    return res.status(400).json({ message: 'Valid quantity is required (must be at least 1)' });
  }

  try {
    const [result] = await db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [parseInt(quantity), cartItemId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart quantity updated successfully' });
  } catch (err) {
    console.error("Update Cart Quantity Error:", err);
    res.status(500).json({ message: 'Server error updating cart quantity' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:cartItemId
// @access  Private
exports.deleteCartItem = async (req, res) => {
  const cartItemId = req.params.cartItemId;

  try {
    const [result] = await db.query('DELETE FROM cart_items WHERE id = ?', [cartItemId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (err) {
    console.error("Delete Cart Item Error:", err);
    res.status(500).json({ message: 'Server error removing item from cart' });
  }
};
