const express = require('express');
const router = express.Router();
const salaController = require('../controllersFelipe/salaController');

// rota só para mediana
router.get('/sala/mediana', salaController.getMedianaCPU);

module.exports = router;
