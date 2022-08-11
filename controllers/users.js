const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function sendError(data) {
  const {
    code, name, message, next,
  } = data;
  const error = new Error();
  error.message = message;
  error.statusCode = code;
  if (name === 'ValidationError' || name === 'CastError') {
    error.statusCode = 400;
  }
  next(error);
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  const ERROR_CODE = 404;
  User.findById({ _id: req.user._id })
    .then((user) => (user ? res.send({ data: user }) : sendError({ code: ERROR_CODE, message: 'Запрашиваемый пользователь не найден' })))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const ERROR_CODE = 404;
  User.findById(req.params.userId)
    .then((user) => (user ? res.send({ data: user }) : sendError({ code: ERROR_CODE, message: 'Запрашиваемый пользователь не найден', next })))
    .catch(next);
};

module.exports.updateUserProfileById = (req, res, next) => {
  const { name, about } = req.body;
  const ERROR_CODE = 404;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => (user ? res.send({ data: user }) : sendError({ code: ERROR_CODE, message: 'Запрашиваемый пользователь не найден', next })))
    .catch((err) => {
      sendError({ name: err.name, message: 'Переданы некорректные данные при обновлении профиля', next });
    });
};

module.exports.updateUserAvatarById = (req, res, next) => {
  const { avatar } = req.body;
  const ERROR_CODE = 404;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => (user ? res.send({ data: user }) : sendError({ code: ERROR_CODE, message: 'Запрашиваемый пользователь не найден', next })))
    .catch((err) => {
      sendError({ res, err, message: 'Переданы некорректные данные при обновлении профиля' });
    });
};
