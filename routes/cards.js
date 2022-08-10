const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  params: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required(),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required(),
  }),
}), dislikeCard);

module.exports = router;
