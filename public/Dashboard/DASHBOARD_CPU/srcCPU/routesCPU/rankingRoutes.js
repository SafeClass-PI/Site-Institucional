const express = require('express');
const router = express.Router();
const rankingController = require('../controllersCPU/rankingController')

router.get('/ranking', rankingController.listarRanking);

module.exports = router;
