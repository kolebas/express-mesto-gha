const router = require('express').Router();
const {
  getUsers, createUser, getUserById, updateUserProfileById, updateUserAvatarById,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUserProfileById);
router.patch('/me/avatar', updateUserAvatarById);

module.exports = router;
