const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
const db = require('../config/db');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const money = (value) => Number(value || 0).toFixed(2);
const NOTIFICATION_TIMEOUT_MS = 8000;

function makeOrderNumber(userId) {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `FK${stamp}${String(userId).padStart(3, '0')}${random}`;
}

function orderLabel(order) {
  return order.order_number || `FK-${order.id}`;
}

function withTimeout(promise, fallback, label, ms = NOTIFICATION_TIMEOUT_MS) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => {
      console.log(`${label} timed out after ${ms}ms`);
      resolve(fallback);
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function base64Url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function makeFirebaseJwt() {
  const email = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const key = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();

  if (!email || !key) {
    throw new Error('Firebase service account is missing');
  }

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };

  const unsigned = `${base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64Url(JSON.stringify(claim))}`;
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(key);
  return `${unsigned}.${base64Url(signature)}`;
}

async function getFirebaseToken() {
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: makeFirebaseJwt()
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NOTIFICATION_TIMEOUT_MS);

  let response;
  try {
    response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.error || 'Firebase token failed');
  }

  return data.access_token;
}

function orderNotification(order, items) {
  return {
    notification: {
      title: `Order #${orderLabel(order)} placed successfully`,
      body: `Paid Rs.${money(order.final_amount)} for ${items.length} item(s).`
    },
    data: {
      type: 'ORDER_PLACED',
      orderId: String(order.id),
      orderNumber: orderLabel(order),
      customerName: String(order.shipping_name),
      finalAmount: money(order.final_amount),
      paymentMethod: String(order.payment_method || 'Card'),
      items: items.map((item) => `${item.name} x ${item.quantity}`).join(', ').slice(0, 900)
    }
  };
}

async function sendFirebaseOrder(order, items, deviceToken) {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const token = deviceToken || process.env.FIREBASE_DEVICE_TOKEN?.trim();
  const payload = orderNotification(order, items);

  if (!projectId || !token || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.log('Firebase not configured. Notification payload:', payload);
    return { sent: false, fallback: true, provider: 'firebase' };
  }

  const accessToken = await getFirebaseToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), NOTIFICATION_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: { token, ...payload } }),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Firebase notification failed');
  }

  return { sent: true, fallback: false, provider: 'firebase', messageId: data.name || '' };
}

function emailText(order, items) {
  const lines = items
    .map((item, index) => `${index + 1}. ${item.name} x ${item.quantity} - Rs.${money(item.price * item.quantity)}`)
    .join('\n');

  return [
    `Order #${orderLabel(order)} placed successfully.`,
    '',
    lines,
    '',
    `Total paid: Rs.${money(order.final_amount)}`,
    `Delivery: ${order.shipping_name}, ${order.shipping_phone}, ${order.shipping_address}`
  ].join('\n');
}

function emailHtml(order, items) {
  const rows = items.map((item, index) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${index + 1}. ${item.name}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">Rs.${money(item.price)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;border:1px solid #dfe5ef;border-radius:8px;overflow:hidden;color:#172337;">
      <div style="background:#2874f0;color:#fff;padding:20px 24px;">
        <h2 style="margin:0;">Flipkart</h2>
        <p style="margin:6px 0 0;">Your order has been placed successfully.</p>
      </div>
      <div style="padding:22px 24px;">
        <h3 style="margin-top:0;color:#2874f0;">Order #${orderLabel(order)}</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
        <p><b>Total MRP:</b> Rs.${money(order.total_mrp)}</p>
        <p><b>Discount:</b> Rs.${money(order.total_discount)}</p>
        <p><b>Total Paid:</b> Rs.${money(order.final_amount)}</p>
        <p><b>Deliver to:</b> ${order.shipping_name}, ${order.shipping_phone}, ${order.shipping_address}</p>
      </div>
    </div>
  `;
}

async function sendOrderEmail(order, items) {
  const host = process.env.SMTP_HOST?.trim();
  const port = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const to = order.email || 'customer@example.com';

  if (!host || !port || !user || !pass) {
    console.log(`Email not configured. Order email for ${to}:\n${emailText(order, items)}`);
    return { sent: false, to, fallback: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      connectionTimeout: NOTIFICATION_TIMEOUT_MS,
      greetingTimeout: NOTIFICATION_TIMEOUT_MS,
      socketTimeout: NOTIFICATION_TIMEOUT_MS,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM?.trim() || user,
      to,
      subject: `Flipkart Order Successful - #${orderLabel(order)}`,
      text: emailText(order, items),
      html: emailHtml(order, items)
    });

    return { sent: true, to, fallback: false };
  } catch (err) {
    console.log(`Email failed for ${to}: ${err.message}`);
    return { sent: false, to, fallback: true };
  }
}

function getTotals(items) {
  return items.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const mrp = Number(item.mrp || price);
    return {
      totalMrp: sum.totalMrp + mrp * item.quantity,
      totalDiscount: sum.totalDiscount + (mrp - price) * item.quantity,
      finalAmount: sum.finalAmount + price * item.quantity
    };
  }, { totalMrp: 0, totalDiscount: 0, finalAmount: 0 });
}

async function getSnapshotCartItems(items = []) {
  const normalizedItems = items
    .map((item) => ({
      productId: Number(item.product_id || item.productId || item.id),
      quantity: Math.max(1, Number(item.quantity || 1))
    }))
    .filter((item) => Number.isInteger(item.productId) && item.productId > 0);

  if (!normalizedItems.length) {
    return [];
  }

  const cartItems = [];
  for (const item of normalizedItems) {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [item.productId]);
    const product = products[0];

    if (!product) {
      throw new Error(`Product ${item.productId} is not available`);
    }

    cartItems.push({
      id: item.productId,
      product_id: item.productId,
      quantity: item.quantity,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock
    });
  }

  return cartItems;
}

async function getOrderItems(orderId) {
  const [items] = await db.query(
    `SELECT oi.*, p.name, p.price as current_price FROM order_items oi
     INNER JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
    [orderId]
  );
  const [images] = await db.query('SELECT * FROM product_images WHERE is_primary = 1');

  return items.map((item) => ({
    ...item,
    image_url: images.find((image) => image.product_id === item.product_id)?.image_url || ''
  }));
}

exports.placeOrder = async (req, res) => {
  const userId = req.user.id;
  const { shipping_name, shipping_phone, shipping_address, payment_method, firebase_device_token, cart_items } = req.body;

  if (!shipping_name || !shipping_phone || !shipping_address) {
    return res.status(400).json({ message: 'Shipping name, phone and address are required' });
  }

  try {
    const [storedCartItems] = await db.query(
      `SELECT c.*, p.name, p.price, p.mrp, p.stock FROM cart_items c
       INNER JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );
    let cartItems = storedCartItems;
    if (!cartItems.length) {
      try {
        cartItems = await getSnapshotCartItems(cart_items);
      } catch (snapshotErr) {
        return res.status(400).json({ message: snapshotErr.message });
      }
    }

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const outOfStock = cartItems.find((item) => Number(item.stock) < Number(item.quantity));
    if (outOfStock) {
      return res.status(400).json({ message: `Insufficient stock for ${outOfStock.name}` });
    }

    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const { totalMrp, totalDiscount, finalAmount } = getTotals(cartItems);
    const deliveryCharges = 0;
    const orderNumber = makeOrderNumber(userId);

    const [orderResult] = await db.query(
      `INSERT INTO orders (order_number, user_id, total_mrp, total_discount, delivery_charges, final_amount, shipping_name, shipping_phone, shipping_address, payment_status, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, userId, totalMrp, totalDiscount, deliveryCharges, finalAmount, shipping_name, shipping_phone, shipping_address, 'Paid', payment_method || 'Card']
    );

    const items = [];
    for (const item of cartItems) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderResult.insertId, item.product_id, item.quantity, item.price]
      );
      await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
      items.push({ id: item.product_id, name: item.name, quantity: item.quantity, price: Number(item.price) });
    }

    await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    const order = {
      id: orderResult.insertId,
      order_number: orderNumber,
      shipping_name,
      shipping_phone,
      shipping_address,
      total_mrp: totalMrp,
      total_discount: totalDiscount,
      delivery_charges: deliveryCharges,
      final_amount: finalAmount,
      payment_method: payment_method || 'Card',
      payment_status: 'Paid',
      email: users[0]?.email || ''
    };

    const emailFallback = { sent: false, to: order.email || 'customer@example.com', fallback: true };
    const firebaseFallback = { sent: false, fallback: true, provider: 'firebase' };
    const [email, firebase] = await Promise.all([
      withTimeout(sendOrderEmail(order, items), emailFallback, 'Order email'),
      withTimeout(
        sendFirebaseOrder(order, items, firebase_device_token).catch((err) => {
          console.log(`Firebase notification failed: ${err.message}`);
          return firebaseFallback;
        }),
        firebaseFallback,
        'Firebase notification'
      )
    ]);

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order.id,
      orderNumber: order.order_number,
      finalAmount,
      emailTo: email.to,
      emailSent: email.sent,
      emailFallback: email.fallback,
      firebaseNotificationSent: firebase.sent,
      firebaseNotificationFallback: firebase.fallback,
      firebaseProvider: firebase.provider,
      firebaseMessageId: firebase.messageId || ''
    });
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Could not place order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );
    res.json({ orders });
  } catch (err) {
    console.error('Orders error:', err);
    res.status(500).json({ message: 'Could not load orders' });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.orderId]);
    const order = orders[0];

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this order' });
    }

    res.json({ order, items: await getOrderItems(req.params.orderId) });
  } catch (err) {
    console.error('Order details error:', err);
    res.status(500).json({ message: 'Could not load order details' });
  }
};

exports.cancelOrder = async (req, res) => {
  const reason = String(req.body.reason || 'Cancelled by customer').slice(0, 240);

  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.orderId]);
    const order = orders[0];

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this order' });
    }
    if (String(order.order_status || '').toLowerCase() === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    const items = await getOrderItems(req.params.orderId);
    await db.query(
      `UPDATE orders SET order_status = ?, payment_status = ?, refund_status = ?, cancel_reason = ?, cancelled_at = ? WHERE id = ? AND user_id = ?`,
      ['Cancelled', 'Refund initiated', 'Refund processing', reason, new Date(), req.params.orderId, req.user.id]
    );

    for (const item of items) {
      await db.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    res.json({
      message: 'Order cancelled and refund initiated',
      order: {
        ...order,
        order_status: 'Cancelled',
        payment_status: 'Refund initiated',
        refund_status: 'Refund processing',
        cancel_reason: reason,
        cancelled_at: new Date().toISOString()
      },
      refund: {
        amount: Number(order.final_amount || 0),
        method: order.payment_method || 'Original payment method',
        eta: '3-5 business days'
      }
    });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ message: 'Could not cancel order' });
  }
};
