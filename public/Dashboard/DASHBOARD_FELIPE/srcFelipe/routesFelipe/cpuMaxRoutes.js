const express = require("express");
const router = express.Router();
const cpuMaxController = require("../controllersFelipe/cpuMaxController");

// rota para máquina crítica
router.get("/maquina-critica/:idSala", cpuMaxController.getMaquinaCritica);

module.exports = router;
