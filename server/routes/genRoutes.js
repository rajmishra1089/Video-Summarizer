const express = require('express');
const {anyPrompt, summarize, quiz , langChange,checkAns} = require('../controllers/genControllers');

const router = express.Router();

router.post('/anyPrompt', anyPrompt);
router.post('/summarize', summarize);
router.post('/quiz', quiz);
router.post('/langChange',langChange);
router.post('/checkAns',checkAns);

module.exports = router;