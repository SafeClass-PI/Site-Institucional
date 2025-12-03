const express = require('express');
const router = express.Router();
const salaController = require('../controllersCPU/salaController');


router.get('/alertas', salaController.getTotalAlertas);
router.get('/ultimos-alertas', salaController.getUltimosAlertas);

module.exports = router;
