const router = require('express').Router();
const { getUsers, createUser } = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/users/:userId', createUser);
router.patch('/users/me', createUser);
router.patch('/users/me/avatar', createUser);

module.exports = router;
