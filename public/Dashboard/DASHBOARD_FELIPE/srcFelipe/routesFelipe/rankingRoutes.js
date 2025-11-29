const express = require('express');
const router = express.Router();
const rankingController = require('../controllersFelipe/rankingController')

router.get('/ranking', rankingController.listarRanking);

module.exports = router;
