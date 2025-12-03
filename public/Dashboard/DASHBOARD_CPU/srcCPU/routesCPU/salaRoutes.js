const express = require('express');
const router = express.Router();
const salaController = require('../controllersCPU/salaController');


router.get('/sala/mediana', salaController.getMedianaCPU);


module.exports = router;
