const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getMe, getUserById, updateUserProfileById, updateUserAvatarById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  params: Joi.object().keys({
    name: Joi.string().required(),
    about: Joi.string().required(),
  }),
}), updateUserProfileById);
router.patch('/me/avatar', celebrate({
  params: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatarById);

module.exports = router;
