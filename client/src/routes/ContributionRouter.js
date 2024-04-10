const express = require('express');
const router = express.Router();
const ContributionController = require('../controllers/ContributionController');

router.get('/getall', ContributionController.getAllContributions)
router.post('/create', ContributionController.createContribution)
router.get('/detail/:id', ContributionController.getDetailContribution);
router.get('/contributionsubmited/:id', ContributionController.getContributionSubmited);
router.delete('/delete/:id', ContributionController.deleteContribution)
router.put('/update/:id', ContributionController.updateContribution);
router.put('/updatecomment/:id', ContributionController.updateCommentContribution);

module.exports = router
