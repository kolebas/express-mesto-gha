const Card = require('../models/card');

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

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => sendError({ res, err }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      sendError({ res, err, message: 'Переданы некорректные данные при создании карточки' });
    });
};

module.exports.deleteCard = (req, res) => {
  const ERROR_CODE = 404;
  Card.deleteOne({ _id: req.params.cardId })
    .then((card) => (card ? res.send({ data: card }) : res.status(ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена.' })))
    .catch((err) => sendError({ res, err }));
};

module.exports.likeCard = (req, res) => {
  const ERROR_CODE = 404;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (card ? res.send({ data: card }) : res.status(ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' })))
    .catch((err) => {
      sendError({ res, err, message: 'Переданы некорректные данные для постановки/снятии лайка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const ERROR_CODE = 404;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (card ? res.send({ data: card }) : res.status(ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена' })))
    .catch((err) => {
      sendError({ res, err, message: 'Переданы некорректные данные для постановки/снятии лайка' });
    });
};
