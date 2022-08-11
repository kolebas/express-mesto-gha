const jwt = require('jsonwebtoken');

const handleAuthError = () => {
  const error = new Error('Необходима авторизация');
  error.statusCode = 401;
  return error;
};

const extractAuthToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(handleAuthError());
  }

  const token = extractAuthToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(handleAuthError());
  }

  req.user = payload;

  next();
};
