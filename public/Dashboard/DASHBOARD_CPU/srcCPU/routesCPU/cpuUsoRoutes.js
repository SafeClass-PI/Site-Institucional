const express = require('express');
const router = express.Router();
const { listarCapturasCpu } = require('../controllersCPU/cpuUsoController');

router.get('/cpu/capturas', listarCapturasCpu);

module.exports = router;
