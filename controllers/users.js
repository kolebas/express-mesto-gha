const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const userData = req.body;

  User.create(userData)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => (user ? res.send({ data: user }) : res.status(404).send({ message: 'Запрашиваемый пользователь не найден' })))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUserProfileById = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => (user ? res.send({ data: user }) : res.status(404).send({ message: 'Запрашиваемый пользователь не найден' })))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUserAvatarById = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => (user ? res.send({ data: user }) : res.status(404).send({ message: 'Запрашиваемый пользователь не найден' })))
    .catch((err) => res.status(500).send({ message: err.message }));
};
