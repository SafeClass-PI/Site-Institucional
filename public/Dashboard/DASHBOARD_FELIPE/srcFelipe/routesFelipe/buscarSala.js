

const express = require('express');
const router = express.Router();
const salaController = require('../controllersFelipe/buscarSalaController');


router.get('/listar', salaController.listar);

module.exports = router;