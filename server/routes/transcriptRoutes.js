const express = require('express');
const {getTranscript} = require('../controllers/transcriptControllers');

const router = express.Router();

router.post('/getTrans', getTranscript);

module.exports = router;