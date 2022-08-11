const Card = require('../models/card');

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

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      sendError({ name: err.name, message: 'Переданы некорректные данные при создании карточки', next });
    });
};

module.exports.deleteCard = (req, res, next) => {
  const ERROR_CODE = 404;
  Card.findOneAndDelete({ _id: req.params.cardId, owner: req.user._id })
    .then((card) => (card ? res.send({ data: card }) : res.status(ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена, или у вас недостаточно прав' })))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const ERROR_CODE = 404;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (card ? res.send({ data: card }) : res.status(ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' })))
    .catch((err) => {
      sendError({ name: err.name, message: 'Переданы некорректные данные для постановки/снятии лайка', next });
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const ERROR_CODE = 404;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => (card ? res.send({ data: card }) : res.status(ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена' })))
    .catch((err) => {
      sendError({ name: err.name, message: 'Переданы некорректные данные для постановки/снятии лайка', next });
    });
};
