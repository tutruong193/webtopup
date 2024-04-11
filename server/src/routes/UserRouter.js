const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authAdminMiddleWare } = require('../middleware/authMiddleware');
router.post('/logout', UserController.logoutUser)
router.post('/send-activation-code/:id', UserController.sendActivationCode);
router.post('/verify-activation-code/:id', UserController.verifyActivationCode);
router.post('/create', UserController.createUser);
router.post('/login', UserController.loginUser);
router.get('/detail/:id',  UserController.detailUser);
router.get('/getall', UserController.getAllUser);
router.put('/update/:id', UserController.updateUser);
router.delete('/delete/:id', authAdminMiddleWare, UserController.deleteUser);
router.get('/search/name', authAdminMiddleWare, UserController.searchUser);
module.exports = router