const matheusModel = require("../modelsMatheus/matheusModel");

function uptimeDowntimeSemestral(req, res) {
    matheusModel.uptimeDowntimeSemestral()
        .then(r => res.status(200).json(r))
        .catch(e => res.status(500).json({ erro: e.sqlMessage || "Erro" }));
}

function alertasPorMesSemestral(req, res) {
    matheusModel.alertasPorMesSemestral()
        .then(r => res.status(200).json(r))
        .catch(e => res.status(500).json({ erro: e.sqlMessage || "Erro" }));
}

function salasMaisAlertasSemestral(req, res) {
    matheusModel.salasMaisAlertasSemestral()
        .then(r => res.status(200).json(r))
        .catch(e => res.status(500).json({ erro: e.sqlMessage || "Erro" }));
}

async function kpisSemestrais(req, res) {
    try {
        const [kpis] = await matheusModel.kpisSemestrais();
        const [sala] = await matheusModel.salaMaisAlertasSemestral();
        res.status(200).json({ uptime: kpis ? kpis.uptime : 0, totalAlertas: kpis ? kpis.totalAlertas : 0, salaMaisAlertas: sala ? sala.sala : null });
    } catch (e) {
        res.status(500).json({ erro: e.sqlMessage || "Erro" });
    }
}

module.exports = {
    uptimeDowntimeSemestral,
    alertasPorMesSemestral,
    salasMaisAlertasSemestral,
    kpisSemestrais
};
