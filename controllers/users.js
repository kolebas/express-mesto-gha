const User = require('../models/user');

function sendError(data) {
  const { res, err, message = 'Что-то пошло не так' } = data;
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    const ERROR_CODE = 400;
    res.status(ERROR_CODE).send({ message });
  } else {
    const ERROR_CODE = 500;
    res.status(ERROR_CODE).send({ message: err.message });
  }
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => sendError({ res, err }));
};

module.exports.createUser = (req, res) => {
  const userData = req.body;

  User.create(userData)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      sendError({ res, err, message: 'Переданы некорректные данные при создании пользователя' });
    });
};

module.exports.getUserById = (req, res) => {
  const ERROR_CODE = 404;
  User.findById(req.params.userId)
    .then((user) => (user ? res.send({ data: user }) : res.status(ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' })))
    .catch((err) => sendError({ res, err }));
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
