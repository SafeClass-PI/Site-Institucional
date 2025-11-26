const express = require("express");
const router = express.Router();
const maquinasController = require("../controllers/maquinasController");

router.post("/cadastrarMaquina", maquinasController.cadastrarMaquina);

router.get("/listar", maquinasController.listar);

router.get("/listarMaquinas", maquinasController.listarMaquinas);


router.get('/exportarCSV', maquinasController.exportarCSV);

router.get('/obter/:id', maquinasController.obterPorId);
router.put('/atualizar/:id', maquinasController.atualizar);
router.delete('/:id', maquinasController.deletar);

module.exports = router;
