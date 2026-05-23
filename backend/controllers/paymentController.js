const path = require('path');
const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function getRazorpayKeys() {
  return {
    keyId: process.env.RAZORPAY_KEY_ID?.trim(),
    keySecret: process.env.RAZORPAY_KEY_SECRET?.trim()
  };
}

function getRazorpayClient() {
  const { keyId, keySecret } = getRazorpayKeys();
  if (!keyId || !keySecret) {
    return null;
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
}

async function razorpayRequest(path, method, body, keyId, keySecret) {
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch(`https://api.razorpay.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data?.error?.description || 'Razorpay API request failed');
    error.status = response.status;
    error.payload = data;
    throw error;
  }
  return data;
}

function buildDemoQr(amount, customerName) {
  const upiPayload = `upi://pay?pa=flipkart.demo@razorpay&pn=Flipkart Clone&am=${amount}&cu=INR&tn=Order payment for ${customerName || 'customer'}`;
  return {
    id: `demo_qr_${Date.now()}`,
    provider: 'demo',
    status: 'active',
    image_url: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiPayload)}`,
    display_image_url: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiPayload)}`,
    image_content: upiPayload,
    payment_amount: Math.round(Number(amount) * 100),
    message: 'Demo QR shown because Razorpay keys are not configured.'
  };
}

exports.createRazorpayQr = async (req, res) => {
  const { amount, customerName } = req.body;
  const payableAmount = Number(amount);

  if (!payableAmount || payableAmount <= 0) {
    return res.status(400).json({ message: 'Valid payment amount is required' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret || process.env.RAZORPAY_FORCE_DEMO_QR === 'true') {
    return res.status(200).json({ qr: buildDemoQr(payableAmount, customerName) });
  }

  try {
    const closeBy = Math.floor(Date.now() / 1000) + (15 * 60);

    const customer = await razorpayRequest('/customers', 'POST', {
      name: customerName || req.user.name || 'Flipkart Customer',
      email: req.user.email || undefined,
      contact: req.user.phone || undefined,
      notes: {
        app: 'flipkart_clone',
        user_id: String(req.user.id)
      }
    }, keyId, keySecret);

    const data = await razorpayRequest('/payments/qr_codes', 'POST', {
      type: 'upi_qr',
      name: 'Flipkart Clone Checkout',
      usage: 'single_use',
      fixed_amount: true,
      payment_amount: Math.round(payableAmount * 100),
      description: `Flipkart Clone order payment for ${customerName || 'customer'}`,
      customer_id: customer.id,
      close_by: closeBy,
      notes: {
        app: 'flipkart_clone',
        user_id: String(req.user.id)
      }
    }, keyId, keySecret);

    return res.status(201).json({
      qr: {
        id: data.id,
        provider: 'razorpay',
        status: data.status,
        image_url: data.image_url,
        display_image_url: data.image_content
          ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(data.image_content)}`
          : data.image_url,
        image_content: data.image_content,
        payment_amount: data.payment_amount,
        close_by: data.close_by,
        message: 'Razorpay QR code created successfully.'
      }
    });
  } catch (error) {
    console.error('Razorpay QR creation failed:', error);
    if (process.env.RAZORPAY_ALLOW_DEMO_FALLBACK !== 'false') {
      return res.status(200).json({
        qr: {
          ...buildDemoQr(payableAmount, customerName),
          message: `Direct Razorpay QR API is unavailable for this account: ${error.message}. Demo QR is shown.`
        }
      });
    }

    return res.status(error.status || 500).json({
      qr: {
        message: error.message || 'Unable to create Razorpay QR'
      },
      error: error.payload || {}
    });
  }
};

exports.createRazorpayOrder = async (req, res) => {
  const payableAmount = Number(req.body.amount);
  const currency = String(req.body.currency || 'INR').toUpperCase();
  const receipt = String(req.body.receipt || `fk_rcpt_${Date.now()}`).slice(0, 40);

  if (!Number.isFinite(payableAmount) || payableAmount < 100) {
    return res.status(400).json({ message: 'Amount must be at least 100 paise' });
  }

  const { keyId } = getRazorpayKeys();
  const razorpay = getRazorpayClient();

  if (!razorpay) {
    return res.status(401).json({ message: 'Razorpay keys are missing in backend .env' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(payableAmount),
      currency,
      receipt,
      notes: {
        app: 'flipkart_clone',
        user_id: String(req.user.id)
      }
    });

    res.status(201).json({
      key_id: keyId,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      order
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(error.statusCode || error.status || 500).json({
      message: error.message || 'Unable to create Razorpay order',
      error: error.error || error.payload || {}
    });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Payment id, order id and signature are required' });
  }

  const { keySecret } = getRazorpayKeys();
  if (!keySecret) {
    return res.status(401).json({ message: 'Razorpay key secret is missing in backend .env' });
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const generatedBuffer = Buffer.from(generatedSignature);
  const receivedBuffer = Buffer.from(razorpay_signature);
  const isValid = generatedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(generatedBuffer, receivedBuffer);

  if (!isValid) {
    return res.status(400).json({ message: 'Invalid Razorpay payment signature' });
  }

  res.json({
    success: true,
    message: 'Payment verified successfully',
    payment_id: razorpay_payment_id,
    order_id: razorpay_order_id
  });
};
