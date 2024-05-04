const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const {
    authAdminMiddleWare,
    authMarketingManagerMiddleWare,
    authMarketingMiddleWare,
    authStudentMiddleWare,
  } = require("../middleware/authMiddleware");
router.post('/logout', UserController.logoutUser)
router.post('/send-activation-code/:id', UserController.sendActivationCode);
router.post('/verify-activation-code/:id', UserController.verifyActivationCode);
router.post('/create', authAdminMiddleWare, UserController.createUser);
router.post('/login', UserController.loginUser);
router.get('/detail/:id',  UserController.detailUser);
router.get('/getall', UserController.getAllUser);
router.put('/update/:id', UserController.updateUser);
router.delete('/delete/:id', authAdminMiddleWare, UserController.deleteUser);
module.exports = router