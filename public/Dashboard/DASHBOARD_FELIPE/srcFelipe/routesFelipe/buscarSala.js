// routes/salaRoutes.js

const express = require('express');
const router = express.Router();
const salaController = require('../controllersFelipe/buscarSalaController');

// Define o endpoint. O frontend fará um GET para esta URL.
router.get('/listar', salaController.listar);

module.exports = router;