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
      if (err.name === 'ValidationError') {
        sendError({ name: err.name, message: 'Переданы некорректные данные при создании карточки', next });
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const ERROR_CODE = 404;
  Card.findById({ _id: req.params.cardId })
    .orFail(() => sendError({ code: ERROR_CODE, message: 'Карточка с указанным _id не найдена', next }))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        sendError({ message: 'нельзя удалить чужую карточку', next });
      }
      return card.remove()
        .then(() => res.send({ data: card }));
    })
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
      if (err.name === 'ValidationError') {
        sendError({ name: err.name, message: 'Переданы некорректные данные для постановки/снятии лайка', next });
      } else {
        next(err);
      }
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
      if (err.name === 'ValidationError') {
        sendError({ name: err.name, message: 'Переданы некорректные данные для постановки/снятии лайка', next });
      } else {
        next(err);
      }
    });
};
