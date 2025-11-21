var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/qtdMaquinasLigadas", function (req, res) {
    dashboardController.qtdMaquinasLigadas(req, res);
});

router.get("/taxaUptimeEscola", function (req, res) {
    dashboardController.taxaUptimeEscola(req, res);
});

router.get("/maquinaMaisCritica", function (req, res) {
    dashboardController.maquinaMaisCritica(req, res);
});

router.get("/qtdAlertas", function (req, res) {
    dashboardController.qtdAlertas(req, res);
});

router.get("/listarSalas", function (req, res) {
    dashboardController.listarSalas(req, res);
});

router.get("/mostrarMaquinas", function (req, res) {
    dashboardController.mostrarMaquinas(req, res);
});

router.get("/listarUltimosAlertas", function (req, res) {
    dashboardController.listarUltimosAlertas(req, res);
});

/* --------------- MÁQUINA ESPECIFICA ------------------------- */

router.get("/kpiStatusMaquina", function (req, res) {
    dashboardController.kpiStatusMaquina(req, res);
});

router.get("/kpiUptimeMaquina", function (req, res) {
    dashboardController.kpiUptimeMaquina(req, res);
});

router.get("/kpiTaxaMaisCritica", function (req, res) {
    dashboardController.kpiTaxaMaisCritica(req, res);
});

router.get("/kpiQtdAlertasMaquina", function (req, res) {
    dashboardController.kpiQtdAlertasMaquina(req, res);
});

router.get("/listarUltimosAlertasMaquina", function (req, res) {
    dashboardController.listarUltimosAlertasMaquina(req, res);
});

router.get("/monitoramentoComponente/:idComponente", function (req, res) {
    dashboardController.monitoramentoComponente(req, res);
});

router.get("/monitoramentoComponenteTempoReal/:idComponente", function (req, res) {
    dashboardController.monitoramentoComponenteTempoReal(req, res);
});

router.get("/monitoramentoComponenteRede/:idComponenteRede", function (req, res) {
    dashboardController.monitoramentoComponenteRede(req, res);
});

router.get("/monitoramentoComponenteRedeTempoReal/:idComponenteRede", function (req, res) {
    dashboardController.monitoramentoComponenteRedeTempoReal(req, res);
});

router.get("/graficoDisponibilidade", function (req, res) {
    dashboardController.graficoDisponibilidade(req, res);
});

router.get("/graficoFalhasPorComponente", function (req, res) {
    dashboardController.graficoFalhasPorComponente(req, res);
});


module.exports = router;