const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.post(
  '/users/:id/upload-avatar',
  upload.single('avatar'),
  userController.uploadAvatar
);
router.delete('/users/:id/delete-avatar', userController.deleteAvatar);

module.exports = router;