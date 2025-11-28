const express = require('express');
const router = express.Router();
const salaController = require('../controllersFelipe/salaController');

// rota para total de alertas
router.get('/alertas', salaController.getTotalAlertas);
router.get('/ultimos-alertas', salaController.getUltimosAlertas);

module.exports = router;
