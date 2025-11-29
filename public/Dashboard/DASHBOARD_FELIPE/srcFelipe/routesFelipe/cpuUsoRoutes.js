const express = require('express');
const router = express.Router();
const { listarCapturasCpu } = require('../controllersFelipe/cpuUsoController');

router.get('/cpu/capturas', listarCapturasCpu);

module.exports = router;
