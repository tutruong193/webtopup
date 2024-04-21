const express = require('express');
const router = express.Router();
const ViewReportController = require('../controllers/ViewReportController');

router.post('/update', ViewReportController.updateView)
router.get('/getselected', ViewReportController.getseletedView)
module.exports = router