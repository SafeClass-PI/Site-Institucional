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
function listarSalasMaquina(req, res) {
    dashboardModel.listarSalasMaquina().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function listarMaquinas(req, res) {
    const idSala = req.params.idSala;

    dashboardModel.listarMaquinas(idSala)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function carregarComponentes(req, res) {
    const idMaquina = req.params.idMaquina;

    dashboardModel.carregarComponentes(idMaquina).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function carregarComponentesRede(req, res) {
    const idMaquina = req.params.idMaquina;

    dashboardModel.carregarComponentesRede(idMaquina).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiStatusMaquina(req, res) {
    const idMaquina = req.params.idMaquina;

    dashboardModel.kpiStatusMaquina(idMaquina).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiUptimeMaquina(req, res) {
    const idMaquina = req.params.idMaquina;

    dashboardModel.kpiUptimeMaquina(idMaquina).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiTaxaMaisCritica(req, res) {
    const idMaquina = req.params.idMaquina;

    dashboardModel.kpiTaxaMaisCritica(idMaquina).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiQtdAlertasMaquina(req, res) {
    const idMaquina = req.params.idMaquina;
    dashboardModel.kpiQtdAlertasMaquina(idMaquina).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function listarUltimosAlertasMaquina(req, res) {
    const idMaquina = req.params.idMaquina;

    dashboardModel.listarUltimosAlertasMaquina(idMaquina).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function monitoramentoComponente(req, res) {
    const idMaquina = req.params.idMaquina;
    const idComponente = req.params.idComponente;

    dashboardModel.monitoramentoComponente(idComponente, idMaquina)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("Erro no monitoramentoComponente:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function monitoramentoComponenteTempoReal(req, res) {
    const idMaquina = req.params.idMaquina;
    const idComponente = req.params.idComponente;

    dashboardModel.monitoramentoComponenteTempoReal(idComponente, idMaquina)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function monitoramentoComponenteRede(req, res) {
    const idMaquina = req.params.idMaquina;
    const idComponenteRede = req.params.idComponenteRede;

    dashboardModel.monitoramentoComponenteRede(idComponenteRede, idMaquina)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function monitoramentoComponenteRedeTempoReal(req, res) {
    const idMaquina = req.params.idMaquina;
    const idComponenteRede = req.params.idComponenteRede;

    dashboardModel.monitoramentoComponenteRedeTempoReal(idComponenteRede, idMaquina)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function graficoDisponibilidade(req, res) {
    const idMaquina = req.params.idMaquina;
    dashboardModel.graficoDisponibilidade(idMaquina).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function graficoFalhasPorComponente(req, res) {
    const idMaquina = req.params.idMaquina;
    dashboardModel.graficoFalhasPorComponente(idMaquina).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}


/* ------------------------------ MÁQUINA ESPECÍFICA --------------------------------------- */


module.exports = {
    listarSalasMaquina,
    listarMaquinas,
    qtdMaquinasLigadas,
    taxaUptimeEscola,
    maquinaMaisCritica,
    qtdAlertas,
    listarSalas,
    mostrarMaquinas,
    listarUltimosAlertas,
    carregarComponentes,
    carregarComponentesRede,
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