var express = require("express");
var router = express.Router();

var biaController = require("../controllersBeatriz/biaController");

router.get("/qtdSolicitacoesDiarias", biaController.buscarQtdSolicitacoesDiarias);

module.exports = router;
