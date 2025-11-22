const express = require("express");
const router = express.Router();
const maquinasController = require("../controllers/maquinasController");

router.post("/cadastrarMaquina", maquinasController.cadastrarMaquina);

router.get("/listar", maquinasController.listar);

router.get("/listarMaquinas", maquinasController.listarMaquinas);

router.get('/exportarCSV', maquinasController.exportarCSV);

module.exports = router;
