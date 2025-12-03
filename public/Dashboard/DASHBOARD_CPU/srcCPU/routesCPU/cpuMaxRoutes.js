const express = require("express");
const router = express.Router();
const cpuMaxController = require("../controllersCPU/cpuMaxController");


router.get("/maquina-critica/:idSala", cpuMaxController.getMaquinaCritica);

module.exports = router;
