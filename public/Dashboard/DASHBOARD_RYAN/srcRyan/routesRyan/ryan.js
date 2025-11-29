var express = require("express");
var router = express.Router();

var ryanController = require("../controllersRyan/ryanController");

router.get("/carregarSalas", function (req, res) {
    ryanController.carregarSalas(req, res);
});

router.get("/kpiStatusRede/:idSala", function (req, res) {
    ryanController.kpiStatusRede(req, res);
});

router.get("/kpiQtdMaquinasInstaveis/:idSala", function (req, res) {
    ryanController.kpiQtdMaquinasInstaveis(req, res);
});

router.get("/kpiHoraMelhorAcesso/:idSala", function (req, res) {
    ryanController.kpiHoraMelhorAcesso(req, res);
});

router.get("/listarMaquinasEstados/:idSala", function (req, res) {
    ryanController.listarMaquinasEstados(req, res);
});

router.get("/obterDadosGraficoPing/:idSala", function (req, res) {
    ryanController.obterDadosGraficoPing(req, res);
});

router.get("/obterDadosGraficoPingUltimo/:idSala", function (req, res) {
    ryanController.obterDadosGraficoPingUltimo(req, res);
});

router.get("/graficoSemana/:idSala", function (req, res) {
    ryanController.graficoSemana(req, res);
});

router.get("/carregarDadosPrevisao/:idSala", function (req, res) {
    ryanController.carregarDadosPrevisao(req, res);
});

module.exports = router;