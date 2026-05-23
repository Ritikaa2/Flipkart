const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

function emailJsConfig(templateId) {
  const serviceId = process.env.EMAILJS_SERVICE_ID?.trim();
  const publicKey = process.env.EMAILJS_PUBLIC_KEY?.trim();
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

  if (!serviceId || !templateId || !publicKey) {
    return null;
  }

  return {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: privateKey || undefined
  };
}

async function sendEmailJsTemplate(templateId, templateParams) {
  const config = emailJsConfig(templateId);

  if (!config) {
    return { sent: false, fallback: true, provider: 'emailjs', reason: 'EmailJS not configured' };
  }

  const recipientEmail = String(
    templateParams.to_email ||
    templateParams.user_email ||
    templateParams.recipient_email ||
    templateParams.to ||
    templateParams.email ||
    ''
  ).trim();

  if (!recipientEmail) {
    throw new Error('EmailJS recipient email is missing');
  }

  const normalizedParams = {
    ...templateParams,
    to: recipientEmail,
    to_email: recipientEmail,
    toEmail: recipientEmail,
    user_email: recipientEmail,
    recipient_email: recipientEmail,
    reply_to: recipientEmail
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(EMAILJS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...config,
        template_params: normalizedParams
      }),
      signal: controller.signal
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || `EmailJS failed with ${response.status}`);
    }

    return { sent: true, fallback: false, provider: 'emailjs', response: text };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  sendEmailJsTemplate
};
