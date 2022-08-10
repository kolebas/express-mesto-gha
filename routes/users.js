const router = require('express').Router();
const {
  getUsers, getMe, getUserById, updateUserProfileById, updateUserAvatarById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', getUserById);
router.patch('/me', updateUserProfileById);
router.patch('/me/avatar', updateUserAvatarById);

module.exports = router;
