const express = require("express");
const router = express.Router();

const maquinasController = require("../controllers/maquinasController");

// CADASTRAR MÁQUINA
router.post("/cadastrarMaquina", (req, res) => {
    maquinasController.cadastrarMaquina(req, res);
});

// LISTAR MÁQUINAS
router.get("/listar", maquinasController.listar);

module.exports = router;
