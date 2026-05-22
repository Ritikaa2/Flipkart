const db = require('../config/db');
const nodemailer = require('nodemailer');
const https = require('https');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Helper to send order confirmation email
async function sendOrderEmail(orderDetails, orderItems) {
  const { id, shipping_name, shipping_phone, shipping_address, final_amount, total_mrp, total_discount } = orderDetails;

  // Build items HTML list
  let itemsHtml = '';
  let itemsText = '';
  orderItems.forEach((item, idx) => {
    itemsHtml += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${idx + 1}. ${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
      </tr>
    `;
    itemsText += `${idx + 1}. ${item.name} x ${item.quantity} - ₹${item.price.toFixed(2)}\n`;
  });

  const emailSubject = `Order Placed Successfully! Order ID: #FK-${id}`;
  
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: #2874f0; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700;">Flipkart Clone</h2>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Thank you for shopping with us!</p>
      </div>
      
      <div style="padding: 24px; color: #212121; line-height: 1.6;">
        <h3 style="color: #2874f0; margin-top: 0; font-size: 18px;">Your order has been placed successfully!</h3>
        <p>Hi <strong>${shipping_name}</strong>,</p>
        <p>We are excited to let you know that your order <strong>#FK-${id}</strong> has been received and is being prepared for shipment.</p>
        
        <h4 style="border-bottom: 2px solid #2874f0; padding-bottom: 5px; margin-bottom: 10px; font-size: 15px; text-transform: uppercase;">Order Details</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 8px; text-align: left;">Item</th>
              <th style="padding: 8px; text-align: center; width: 60px;">Qty</th>
              <th style="padding: 8px; text-align: right; width: 100px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="margin-top: 15px; background-color: #f9f9f9; padding: 15px; border-radius: 6px; font-size: 14px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Total MRP:</span> <span style="font-weight: 600; float: right;">₹${total_mrp.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #388e3c;">
            <span>Discount:</span> <span style="font-weight: 600; float: right;">- ₹${total_discount.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Delivery Charges:</span> <span style="font-weight: 600; float: right; color: #388e3c;">FREE</span>
          </div>
          <div style="border-top: 1px solid #e0e0e0; padding-top: 8px; margin-top: 8px; font-size: 16px; font-weight: 700; display: flex; justify-content: space-between;">
            <span>Final Paid Amount:</span> <span style="float: right; color: #2874f0;">₹${final_amount.toFixed(2)}</span>
          </div>
        </div>
        
        <h4 style="border-bottom: 2px solid #2874f0; padding-bottom: 5px; margin-bottom: 10px; margin-top: 20px; font-size: 15px; text-transform: uppercase;">Shipping Address</h4>
        <p style="font-size: 14px; background-color: #f9f9f9; padding: 15px; border-radius: 6px;">
          <strong>Name:</strong> ${shipping_name}<br />
          <strong>Phone:</strong> ${shipping_phone}<br />
          <strong>Address:</strong> ${shipping_address}
        </p>
        
        <p style="font-size: 13px; color: #666; text-align: center; margin-top: 30px;">
          This is a simulated transaction from your Flipkart Clone application.
        </p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #878787; border-top: 1px solid #e0e0e0;">
        &copy; 2026 Flipkart Clone E-Commerce. All rights reserved.
      </div>
    </div>
  `;

  // Set up Nodemailer transporter
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = process.env.SMTP_PORT?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM?.trim() || smtpUser,
        to: orderDetails.email || 'customer@example.com',
        subject: emailSubject,
        text: `Order Placed successfully!\n\nOrder ID: #FK-${id}\n\nItems:\n${itemsText}\nFinal Paid Amount: ₹${final_amount.toFixed(2)}`,
        html: emailHtml,
      });

      console.log(`Email notification successfully sent for Order ID: #FK-${id}`);
    } catch (err) {
      console.error("Nodemailer sent error, logging instead:", err.message);
      logEmailFallback(orderDetails, itemsText);
    }
  } else {
    logEmailFallback(orderDetails, itemsText);
  }
}

async function sendCompleteOrderEmail(orderDetails, orderItems) {
  const itemsRows = orderItems.map((item, idx) => {
    const lineTotal = item.price * item.quantity;
    return `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${idx + 1}. ${item.name}</td>
        <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">Rs.${item.price.toFixed(2)}</td>
        <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;">Rs.${lineTotal.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const itemsText = orderItems.map((item, idx) => (
    `${idx + 1}. ${item.name} x ${item.quantity} - Rs.${(item.price * item.quantity).toFixed(2)}`
  )).join('\n');

  const to = orderDetails.email || 'customer@example.com';
  const subject = `Flipkart Order Successful - #FK-${orderDetails.id}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;border:1px solid #dfe5ef;border-radius:10px;overflow:hidden;color:#172337;">
      <div style="background:#2874f0;color:#fff;padding:22px 26px;">
        <h1 style="margin:0;font-size:24px;">Flipkart</h1>
        <p style="margin:6px 0 0;font-size:14px;">Your order has been placed successfully.</p>
      </div>
      <div style="padding:24px 26px;">
        <h2 style="margin:0 0 10px;color:#2874f0;font-size:20px;">Order #FK-${orderDetails.id}</h2>
        <p style="margin:0 0 18px;">Hi <b>${orderDetails.shipping_name}</b>, your complete order details are below.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:18px;">
          <thead>
            <tr style="background:#f5f7fb;">
              <th style="padding:10px;text-align:left;">Product</th>
              <th style="padding:10px;text-align:center;">Qty</th>
              <th style="padding:10px;text-align:right;">Unit Price</th>
              <th style="padding:10px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>
        <div style="background:#f8fbff;border:1px solid #dfe8ff;border-radius:8px;padding:16px;margin-bottom:18px;">
          <p style="display:flex;justify-content:space-between;margin:0 0 8px;"><span>Total MRP</span><b>Rs.${orderDetails.total_mrp.toFixed(2)}</b></p>
          <p style="display:flex;justify-content:space-between;margin:0 0 8px;color:#388e3c;"><span>Discount</span><b>- Rs.${orderDetails.total_discount.toFixed(2)}</b></p>
          <p style="display:flex;justify-content:space-between;margin:0 0 8px;"><span>Delivery Charges</span><b>${Number(orderDetails.delivery_charges || 0) === 0 ? 'FREE' : `Rs.${Number(orderDetails.delivery_charges).toFixed(2)}`}</b></p>
          <p style="display:flex;justify-content:space-between;margin:0 0 8px;"><span>Payment Method</span><b>${orderDetails.payment_method || 'Card'}</b></p>
          <p style="display:flex;justify-content:space-between;margin:0 0 8px;"><span>Payment Status</span><b style="color:#388e3c;">${orderDetails.payment_status || 'Paid'}</b></p>
          <p style="display:flex;justify-content:space-between;margin:12px 0 0;padding-top:12px;border-top:1px dashed #c7d2e5;font-size:18px;"><span>Total Paid</span><b style="color:#2874f0;">Rs.${orderDetails.final_amount.toFixed(2)}</b></p>
        </div>
        <div style="background:#fff8e8;border:1px solid #ffe2aa;border-radius:8px;padding:16px;">
          <h3 style="margin:0 0 8px;font-size:16px;">Delivery Details</h3>
          <p style="margin:0 0 6px;"><b>Name:</b> ${orderDetails.shipping_name}</p>
          <p style="margin:0 0 6px;"><b>Phone:</b> ${orderDetails.shipping_phone}</p>
          <p style="margin:0;"><b>Address:</b> ${orderDetails.shipping_address}</p>
        </div>
        <p style="font-size:12px;color:#6b7280;text-align:center;margin:22px 0 0;">Track this order anytime from My Orders in your Flipkart account.</p>
      </div>
    </div>
  `;

  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = process.env.SMTP_PORT?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    logEmailFallback(orderDetails, itemsText);
    return { sent: false, to, fallback: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: { user: smtpUser, pass: smtpPass }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM?.trim() || smtpUser,
      to,
      subject,
      text: `Order #FK-${orderDetails.id} placed successfully.\n\n${itemsText}\n\nTotal paid: Rs.${orderDetails.final_amount.toFixed(2)}\nPayment: ${orderDetails.payment_method || 'Card'} (${orderDetails.payment_status || 'Paid'})\nDelivery: ${orderDetails.shipping_name}, ${orderDetails.shipping_phone}, ${orderDetails.shipping_address}`,
      html
    });

    console.log(`Complete order email sent to ${to} for Order ID: #FK-${orderDetails.id}`);
    return { sent: true, to, fallback: false };
  } catch (err) {
    console.error('Complete order email failed, logging instead:', err.message);
    logEmailFallback(orderDetails, itemsText);
    return { sent: false, to, fallback: true };
  }
}

// Fallback visual logger in case of no mail server credentials
function logEmailFallback(orderDetails, itemsText) {
  console.log("\n========================================================================");
  console.log("             📧  MOCK EMAIL NOTIFICATION SIMULATED  📧");
  console.log("========================================================================");
  console.log(`To      : ${orderDetails.email || 'customer@example.com'}`);
  console.log(`Subject : Order Placed Successfully! Order ID: #FK-${orderDetails.id}`);
  console.log("------------------------------------------------------------------------");
  console.log("Invoice details:");
  console.log(`Customer: ${orderDetails.shipping_name}`);
  console.log(`Phone   : ${orderDetails.shipping_phone}`);
  console.log(`Address : ${orderDetails.shipping_address}`);
  console.log("------------------------------------------------------------------------");
  console.log("Purchased Items:");
  console.log(itemsText.trim());
  console.log("------------------------------------------------------------------------");
  console.log(`Total MRP       : ₹${orderDetails.total_mrp.toFixed(2)}`);
  console.log(`Total Discount  : ₹${orderDetails.total_discount.toFixed(2)}`);
  console.log(`Final Paid      : ₹${orderDetails.final_amount.toFixed(2)}`);
  console.log("========================================================================\n");
}

function buildOrderSmsText(orderDetails) {
  return `Flipkart: Your order #FK-${orderDetails.id} is successful. Amount paid Rs.${orderDetails.final_amount.toFixed(2)}. We will deliver to ${orderDetails.shipping_name}. Track it in My Orders.`;
}

function base64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getFirebasePrivateKey() {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();
}

function createFirebaseJwt() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = getFirebasePrivateKey();

  if (!clientEmail || !privateKey) {
    throw new Error('Firebase service account email/private key are not configured');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };

  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claim))}`;
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(privateKey);
  return `${unsigned}.${base64Url(signature)}`;
}

function httpsPostJson(url, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: parsed.hostname,
      path: `${parsed.pathname}${parsed.search}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const parsedData = data ? JSON.parse(data) : {};
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(parsedData);
        } else {
          reject(new Error(parsedData.error_description || parsedData.error?.message || data || `HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function getFirebaseAccessToken() {
  const assertion = createFirebaseJwt();
  const response = await new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    }).toString();

    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const parsed = data ? JSON.parse(data) : {};
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(parsed);
        } else {
          reject(new Error(parsed.error_description || parsed.error || data));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  return response.access_token;
}

function buildFirebaseOrderPayload(orderDetails, orderItems) {
  const itemsSummary = orderItems
    .map(item => `${item.name} x ${item.quantity}`)
    .join(', ');

  return {
    notification: {
      title: `Order #FK-${orderDetails.id} placed successfully`,
      body: `Paid Rs.${orderDetails.final_amount.toFixed(2)} for ${orderItems.length} item(s).`
    },
    data: {
      type: 'ORDER_PLACED',
      orderId: String(orderDetails.id),
      customerName: String(orderDetails.shipping_name),
      phone: String(orderDetails.shipping_phone),
      address: String(orderDetails.shipping_address),
      paymentMethod: String(orderDetails.payment_method || 'Card'),
      paymentStatus: String(orderDetails.payment_status || 'Paid'),
      totalMrp: String(orderDetails.total_mrp.toFixed(2)),
      discount: String(orderDetails.total_discount.toFixed(2)),
      finalAmount: String(orderDetails.final_amount.toFixed(2)),
      items: itemsSummary.slice(0, 900)
    }
  };
}

async function sendFirebaseOrderNotification(orderDetails, orderItems, requestToken) {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const token = requestToken || process.env.FIREBASE_DEVICE_TOKEN?.trim();
  const payload = buildFirebaseOrderPayload(orderDetails, orderItems);

  if (!projectId || !token || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.log("\n========================================================================");
    console.log("             MOCK FIREBASE ORDER NOTIFICATION");
    console.log("========================================================================");
    console.log(`Project : ${projectId || '(missing FIREBASE_PROJECT_ID)'}`);
    console.log(`Token   : ${token ? `${token.slice(0, 18)}...` : '(missing FIREBASE_DEVICE_TOKEN)'}`);
    console.log("Payload :");
    console.log(JSON.stringify(payload, null, 2));
    console.log("========================================================================\n");
    return { sent: false, fallback: true, provider: 'firebase', token: token || '' };
  }

  const accessToken = await getFirebaseAccessToken();
  const response = await httpsPostJson(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    { message: { token, ...payload } },
    { Authorization: `Bearer ${accessToken}` }
  );

  console.log(`Firebase order notification sent for Order ID: #FK-${orderDetails.id}`);
  return { sent: true, fallback: false, provider: 'firebase', token, messageId: response.name || '' };
}

function normalizeSmsPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return phone.startsWith('+') ? phone : `+${digits}`;
}

function sendTwilioSms(to, body) {
  return new Promise((resolve, reject) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
    const from = process.env.TWILIO_FROM_NUMBER?.trim();

    if (!accountSid || !authToken || !from) {
      reject(new Error('Twilio SMS credentials are not configured'));
      return;
    }

    const postData = new URLSearchParams({ To: to, From: from, Body: body }).toString();
    const req = https.request({
      hostname: 'api.twilio.com',
      path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
      method: 'POST',
      auth: `${accountSid}:${authToken}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Twilio SMS failed with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function sendOrderSms(orderDetails) {
  const to = normalizeSmsPhone(orderDetails.sms_phone || orderDetails.shipping_phone);
  const body = buildOrderSmsText(orderDetails);

  if (!to) {
    console.log('SMS notification skipped: no phone number available.');
    return { sent: false, to: '', fallback: true };
  }

  try {
    await sendTwilioSms(to, body);
    console.log(`SMS notification successfully sent to ${to} for Order ID: #FK-${orderDetails.id}`);
    return { sent: true, to, fallback: false };
  } catch (err) {
    console.log("\n========================================================================");
    console.log("             MOCK SMS NOTIFICATION SIMULATED");
    console.log("========================================================================");
    console.log(`To      : ${to}`);
    console.log(`Message : ${body}`);
    console.log(`Reason  : ${err.message}`);
    console.log("========================================================================\n");
    return { sent: false, to, fallback: true };
  }
}

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
exports.placeOrder = async (req, res) => {
  const userId = req.user.id;
  const { shipping_name, shipping_phone, shipping_address, payment_method, firebase_device_token } = req.body;

  if (!shipping_name || !shipping_phone || !shipping_address) {
    return res.status(400).json({ message: 'Shipping name, phone, and address are required' });
  }

  try {
    // 1. Fetch user's cart items
    const [cartItems] = await db.query(
      `SELECT c.*, p.name, p.price, p.mrp, p.stock FROM cart_items c 
       INNER JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cannot place order, cart is empty' });
    }

    // 2. Fetch user's registered email/phone for notifications
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const userEmail = users.length > 0 ? users[0].email : '';
    const registeredPhone = users.length > 0 ? users[0].phone : '';

    // 3. Calculate financial totals
    let totalMrp = 0;
    let totalDiscount = 0;
    let finalAmount = 0;

    for (const item of cartItems) {
      totalMrp += parseFloat(item.mrp) * item.quantity;
      totalDiscount += (parseFloat(item.mrp) - parseFloat(item.price)) * item.quantity;
      finalAmount += parseFloat(item.price) * item.quantity;

      // Verify stock level
      if (item.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${item.name}. Available: ${item.stock}, Requested: ${item.quantity}`
        });
      }
    }

    // Standard Delivery charge calculations
    const deliveryCharges = 0; // Free delivery matching Flipkart premium cart checkout

    // 4. Create Order Transaction record
    const [orderResult] = await db.query(
      `INSERT INTO orders (user_id, total_mrp, total_discount, delivery_charges, final_amount, shipping_name, shipping_phone, shipping_address, payment_status, payment_method) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        totalMrp,
        totalDiscount,
        deliveryCharges,
        finalAmount,
        shipping_name,
        shipping_phone,
        shipping_address,
        'Paid',
        payment_method || 'Card'
      ]
    );

    const orderId = orderResult.insertId;

    // 5. Insert Order Items, Decrement Product stock and remove from cart
    const purchasedItems = [];
    for (const item of cartItems) {
      // Create order item
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Decrement stock in database
      await db.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );

      purchasedItems.push({
        id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price)
      });
    }

    // 6. Clear user's cart items
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    // 7. Fire mock or real Email confirmation asynchronously
    const orderDetails = {
      id: orderId,
      shipping_name,
      shipping_phone,
      shipping_address,
      total_mrp: totalMrp,
      total_discount: totalDiscount,
      delivery_charges: deliveryCharges,
      final_amount: finalAmount,
      payment_method: payment_method || 'Card',
      payment_status: 'Paid',
      email: userEmail,
      sms_phone: registeredPhone || shipping_phone
    };
    
    const emailResult = await sendCompleteOrderEmail(orderDetails, purchasedItems);
    const firebaseResult = await sendFirebaseOrderNotification(orderDetails, purchasedItems, firebase_device_token);

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: orderId,
      finalAmount: finalAmount,
      emailTo: emailResult.to,
      emailSent: emailResult.sent,
      emailFallback: emailResult.fallback,
      firebaseNotificationSent: firebaseResult.sent,
      firebaseNotificationFallback: firebaseResult.fallback,
      firebaseProvider: firebaseResult.provider,
      firebaseMessageId: firebaseResult.messageId || ''
    });
  } catch (err) {
    console.error("Place Order Error:", err);
    res.status(500).json({ message: 'Server error placing order' });
  }
};

// @desc    Get user order history
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// @desc    Get order details by order ID
// @route   GET /api/orders/details/:orderId
// @access  Private
exports.getOrderDetails = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Fetch order record
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Ensure user owns this order (optional auth check)
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this order' });
    }

    // Fetch order items
    const [orderItems] = await db.query(
      `SELECT oi.*, p.name, p.price as current_price FROM order_items oi 
       INNER JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );

    // Fetch primary images for items
    const [images] = await db.query('SELECT * FROM product_images WHERE is_primary = 1');

    const itemsWithImages = orderItems.map(item => {
      const img = images.find(i => i.product_id === item.product_id);
      return {
        ...item,
        image_url: img ? img.image_url : ''
      };
    });

    res.status(200).json({
      order,
      items: itemsWithImages
    });
  } catch (err) {
    console.error("Get Order Details Error:", err);
    res.status(500).json({ message: 'Server error fetching order details' });
  }
};

// @desc    Cancel an order and start refund processing
// @route   PUT /api/orders/:orderId/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.orderId;
  const reason = String(req.body.reason || 'Cancelled by customer').slice(0, 240);

  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];
    if (order.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this order' });
    }

    if (String(order.order_status || '').toLowerCase() === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    const [items] = await db.query(
      'SELECT oi.*, p.name, p.price as current_price FROM order_items oi INNER JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
      [orderId]
    );

    await db.query(
      `UPDATE orders SET order_status = ?, payment_status = ?, refund_status = ?, cancel_reason = ?, cancelled_at = ? WHERE id = ? AND user_id = ?`,
      ['Cancelled', 'Refund initiated', 'Refund processing', reason, new Date(), orderId, userId]
    );

    for (const item of items) {
      await db.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    const refundAmount = parseFloat(order.final_amount || 0);

    res.status(200).json({
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
        amount: refundAmount,
        method: order.payment_method || 'Original payment method',
        eta: '3-5 business days'
      }
    });
  } catch (err) {
    console.error("Cancel Order Error:", err);
    res.status(500).json({ message: 'Server error cancelling order' });
  }
};
