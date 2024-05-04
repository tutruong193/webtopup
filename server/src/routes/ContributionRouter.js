const express = require('express');
const router = express.Router();
const ContributionController = require('../controllers/ContributionController');
const {
    authAdminMiddleWare,
    authMarketingManagerMiddleWare,
    authMarketingMiddleWare,
    authStudentMiddleWare,
  } = require("../middleware/authMiddleware");
router.get('/getall', ContributionController.getAllContributions)
router.post('/create',authStudentMiddleWare, ContributionController.createContribution)
router.get('/detail/:id', ContributionController.getDetailContribution);
router.get('/contributionsubmited/:id', ContributionController.getContributionSubmited);
router.delete('/delete/:id', authStudentMiddleWare, ContributionController.deleteContribution)
router.put('/update/:id',ContributionController.updateContribution);
router.put('/updatecomment/:id', ContributionController.updateCommentContribution);

module.exports = router
