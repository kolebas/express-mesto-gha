const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function sendError(data) {
  const { code, name, message } = data;
  const error = new Error();
  error.message = message;
  error.statusCode = code;
  if (name === 'ValidationError' || name === 'CastError') {
    error.statusCode = 400;
  }
  return error;
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => sendError({ code: err.status, name: err.name }));
};

module.exports.getMe = (req, res) => {
  const ERROR_CODE = 404;
  User.findById({ _id: req.user._id })
    .then((user) => (user ? res.send({ data: user }) : sendError({ code: ERROR_CODE, message: 'Запрашиваемый пользователь не найден' })))
    .catch((err) => sendError({ err }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => sendError({ res, err }));
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      sendError({ res, err, message: 'Переданы некорректные данные при создании пользователя' });
    });
};

module.exports.getUserById = (req, res) => {
  const ERROR_CODE = 404;
  User.findById(req.params.userId)
    .then((user) => (user ? res.send({ data: user }) : sendError({ code: ERROR_CODE, message: 'Запрашиваемый пользователь не найден' })))
    .catch((err) => sendError({ err }));
};

module.exports.updateUserProfileById = (req, res) => {
  const { name, about } = req.body;
  const ERROR_CODE = 404;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => (user ? res.send({ data: user }) : res.status(ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' })))
    .catch((err) => {
      sendError({ res, err, message: 'Переданы некорректные данные при обновлении профиля' });
    });
};

module.exports.updateUserAvatarById = (req, res) => {
  const { avatar } = req.body;
  const ERROR_CODE = 404;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => (user ? res.send({ data: user }) : res.status(ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' })))
    .catch((err) => {
      sendError({ res, err, message: 'Переданы некорректные данные при обновлении профиля' });
    });
};
