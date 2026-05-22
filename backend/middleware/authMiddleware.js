const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.get('Authorization') || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Login required' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'flipkart_secret_key_12345');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
