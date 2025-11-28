var express = require("express");
var router = express.Router();

var ryanController = require("../controllersRyan/ryanController");


router.get("/carregarSalas", function (req, res) {
    ryanController.carregarSalas(req, res);
});

router.get("/kpiStatusRede", function (req, res) {
    ryanController.kpiStatusRede(req, res);
});

router.get("/kpiQtdMaquinasInstaveis", function (req, res) {
    ryanController.kpiQtdMaquinasInstaveis(req, res);
});

router.get("/kpiHoraMelhorAcesso", function (req, res) {
    ryanController.kpiHoraMelhorAcesso(req, res);
});

router.get("/listarMaquinasEstados", function (req, res) {
    ryanController.listarMaquinasEstados(req, res);
});

router.get("/obterDadosGraficoPing", function (req, res) {
    ryanController.obterDadosGraficoPing(req, res);
});

router.get("/obterDadosGraficoPingUltimo", function (req, res) {
    ryanController.obterDadosGraficoPingUltimo(req, res);
});





module.exports = router;