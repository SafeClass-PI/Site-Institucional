const express = require('express');
const router = express.Router();
const salaController = require('../controllersFelipe/salaController');


router.get('/sala/mediana', salaController.getMedianaCPU);


module.exports = router;
