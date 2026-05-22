const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

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
  const { amount } = req.body;
  const payableAmount = Number(amount);

  if (!payableAmount || payableAmount <= 0) {
    return res.status(400).json({ message: 'Valid payment amount is required' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    return res.status(400).json({ message: 'Razorpay keys are missing in backend .env' });
  }

  try {
    const order = await razorpayRequest('/orders', 'POST', {
      amount: Math.round(payableAmount * 100),
      currency: 'INR',
      receipt: `fk_rcpt_${Date.now()}`,
      notes: {
        app: 'flipkart_clone',
        user_id: String(req.user.id)
      }
    }, keyId, keySecret);

    res.status(201).json({
      key_id: keyId,
      order
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(error.status || 500).json({
      message: error.message || 'Unable to create Razorpay order',
      error: error.payload || {}
    });
  }
};
