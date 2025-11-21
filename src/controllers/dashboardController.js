var dashboardModel = require("../models/dashboardModel");

/* ------------------------------- PAINEL GERAL --------------------------------------- */

function qtdMaquinasLigadas(req, res) {
    dashboardModel.qtdMaquinasLigadas().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function taxaUptimeEscola(req, res) {
    dashboardModel.taxaUptimeEscola().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function maquinaMaisCritica(req, res) {
    dashboardModel.maquinaMaisCritica().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}


function qtdAlertas(req, res) {
    dashboardModel.qtdAlertas().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function listarSalas(req, res) {
    dashboardModel.listarSalas().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function mostrarMaquinas(req, res) {
    const idSala = req.query.idSala;

    dashboardModel.mostrarMaquinas(idSala)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao listar máquinas:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarUltimosAlertas(req, res) {
    const idSala = req.query.idSala;

    dashboardModel.listarUltimosAlertas(idSala)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao listar máquinas:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

/* -------------- MÁQUINA ESPECIFICA ------------------------ */

function kpiStatusMaquina(req, res) {
    dashboardModel.kpiStatusMaquina().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiUptimeMaquina(req, res) {
    dashboardModel.kpiUptimeMaquina().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiTaxaMaisCritica(req, res) {
    dashboardModel.kpiTaxaMaisCritica().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiQtdAlertasMaquina(req, res) {
    dashboardModel.kpiQtdAlertasMaquina().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function listarUltimosAlertasMaquina(req, res) {
    dashboardModel.listarUltimosAlertasMaquina().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}



function monitoramentoComponente(req, res) {
    const idComponente = req.params.idComponente;

    dashboardModel.monitoramentoComponente(idComponente)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function monitoramentoComponenteTempoReal(req, res) {
    const idComponente = req.params.idComponente;

    dashboardModel.monitoramentoComponenteTempoReal(idComponente)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function monitoramentoComponenteRede(req, res) {
    const idComponenteRede = req.params.idComponenteRede;

    dashboardModel.monitoramentoComponenteRede(idComponenteRede)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function monitoramentoComponenteRedeTempoReal(req, res) {
    const idComponenteRede = req.params.idComponenteRede;

    dashboardModel.monitoramentoComponenteRedeTempoReal(idComponenteRede)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function graficoDisponibilidade(req, res) {
    dashboardModel.graficoDisponibilidade().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function graficoFalhasPorComponente(req, res) {
    dashboardModel.graficoFalhasPorComponente().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}


/* ------------------------------ MÁQUINA ESPECÍFICA --------------------------------------- */


module.exports = {
    qtdMaquinasLigadas,
    taxaUptimeEscola,
    maquinaMaisCritica,
    qtdAlertas,
    listarSalas,
    mostrarMaquinas,
    listarUltimosAlertas,
    kpiStatusMaquina,
    kpiUptimeMaquina,
    kpiTaxaMaisCritica,
    kpiQtdAlertasMaquina,
    listarUltimosAlertasMaquina,
    monitoramentoComponente,
    monitoramentoComponenteTempoReal,
    monitoramentoComponenteRede,
    monitoramentoComponenteRedeTempoReal,
    graficoDisponibilidade,
    graficoFalhasPorComponente
}