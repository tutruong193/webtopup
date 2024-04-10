const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');
const { authAdminMiddleWare } = require('../middleware/authMiddleware');

router.post('/create',  EventController.createEvent)
router.put('/update/:id',authAdminMiddleWare, EventController.updateEvent)
router.delete('/delete/:id',authAdminMiddleWare, EventController.deleteEvent)
router.get('/getallevent', EventController.getAllEvents)
router.get('/getvalidevent', EventController.getValidEvents)
router.get('/detail/:id', EventController.detailEvent);
module.exports = router
