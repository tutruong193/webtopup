const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');

router.get('/getall', NotificationController.getAllNotifications)
router.put('/readedall', NotificationController.readAllNotifications)
router.put('/readedone/:id', NotificationController.readOneNotifications)
module.exports = router