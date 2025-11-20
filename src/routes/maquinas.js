const express = require("express");
const router = express.Router();
const maquinasController = require("../controllers/maquinasController");

router.post("/cadastrarMaquina", maquinasController.cadastrarMaquina);
router.get("/listar", maquinasController.listar);

module.exports = router;
