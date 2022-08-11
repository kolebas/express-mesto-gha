const jwt = require('jsonwebtoken');
const Auth = require('../errors/auth-err');

const extractAuthToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Auth('Необходима авторизация');
  }

  const token = extractAuthToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new Auth('Необходима авторизация');
  }

  req.user = payload;

  next();
};
