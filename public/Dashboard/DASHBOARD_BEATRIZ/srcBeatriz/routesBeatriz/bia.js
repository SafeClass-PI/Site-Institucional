var express = require("express");
var router = express.Router();
var biaController = require("../controllersBeatriz/biaController");

router.get("/qtdSolicitacoesDiarias", biaController.buscarQtdSolicitacoesDiarias);
router.get("/usuario/online", biaController.listarUsuariosOnline); 
router.get("/totalUsuarios", biaController.totalUsuarios);
router.post("/usuario/online", biaController.marcarOnline); 

module.exports = router;
