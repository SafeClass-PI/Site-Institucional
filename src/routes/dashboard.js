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

router.get("/listarSalasMaquina", (req, res) =>
    dashboardController.listarSalasMaquina(req, res)
);

router.get("/listarMaquinas/:idSala", (req, res) =>
    dashboardController.listarMaquinas(req, res)
);

router.get("/carregarComponentesRede/:idMaquina", (req, res) =>
    dashboardController.carregarComponentesRede(req, res)
);

router.get("/carregarComponentes/:idMaquina", (req, res) =>
    dashboardController.carregarComponentes(req, res)
);

router.get("/kpiStatusMaquina/:idMaquina", (req, res) =>
    dashboardController.kpiStatusMaquina(req, res)
);

router.get("/kpiUptimeMaquina/:idMaquina", (req, res) =>
    dashboardController.kpiUptimeMaquina(req, res)
);

router.get("/kpiTaxaMaisCritica/:idMaquina", (req, res) =>
    dashboardController.kpiTaxaMaisCritica(req, res)
);

router.get("/kpiQtdAlertasMaquina/:idMaquina", (req, res) =>
    dashboardController.kpiQtdAlertasMaquina(req, res)
);

router.get("/listarUltimosAlertasMaquina/:idMaquina", (req, res) =>
    dashboardController.listarUltimosAlertasMaquina(req, res)
);

router.get("/monitoramentoComponente/:idComponente/:idMaquina", (req, res) =>
    dashboardController.monitoramentoComponente(req, res)
);

router.get("/monitoramentoComponenteTempoReal/:idComponente/:idMaquina", (req, res) =>
    dashboardController.monitoramentoComponenteTempoReal(req, res)
);

router.get("/monitoramentoComponenteRede/:idComponenteRede/:idMaquina/", (req, res) =>
    dashboardController.monitoramentoComponenteRede(req, res)
);

router.get("/monitoramentoComponenteRedeTempoReal/:idComponenteRede/:idMaquina", (req, res) =>
    dashboardController.monitoramentoComponenteRedeTempoReal(req, res)
);

router.get("/graficoDisponibilidade/:idMaquina", (req, res) =>
    dashboardController.graficoDisponibilidade(req, res)
);

router.get("/graficoFalhasPorComponente/:idMaquina", (req, res) =>
    dashboardController.graficoFalhasPorComponente(req, res)
);


module.exports = router;