const express = require('express');
const router = express.Router();
const MaquinaController = require('../controllersCPU/maquinaController');

router.get('/maquinas', MaquinaController.filtrarPorSala);

module.exports = router;
