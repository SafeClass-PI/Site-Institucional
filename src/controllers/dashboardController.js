var dashboardModel = require("../models/dashboardModel");

/* ------------------------------- PAINEL GERAL --------------------------------------- */

function qtdMaquinasLigadas(req, res) {
    dashboardModel.qtdMaquinasLigadas().then(function (resultado) {
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

/* ------------------------------ MÁQUINA ESPECÍFICA --------------------------------------- */



module.exports = {
    qtdMaquinasLigadas,
    qtdAlertas
}