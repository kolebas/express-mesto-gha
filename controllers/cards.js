const Card = require('../models/card');

function sendError(data) {
  const { res, err, message } = data;
  if (err.name === 'ValidationError') {
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
    name, link, ownerId, likes, createAt,
  } = req.body;

  Card.create({
    name, link, owner: ownerId, likes, createAt,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      sendError({ res, err, message: 'Переданы некорректные данные при создании карточки' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.deleteOne({ _id: req.params.cardId })
    .then((card) => (card ? res.send({ data: card }) : res.status(404).send({ message: 'Карточка с указанным _id не найдена.' })))
    .catch((err) => sendError({ res, err }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (card ? res.send({ data: card }) : res.status(404).send({ message: 'Передан несуществующий _id карточки' })))
    .catch((err) => {
      sendError({ res, err, message: 'Переданы некорректные данные для постановки/снятии лайка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (card ? res.send({ data: card }) : res.status(400).send({ message: 'Запрашиваемая карточка не найдена' })))
    .catch((err) => {
      sendError({ res, err, message: 'Переданы некорректные данные для постановки/снятии лайка' });
    });
};
