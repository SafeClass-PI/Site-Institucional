var ryanModel = require("../modelsRyan/ryanModel");

function kpiStatusRede(req, res) {
    ryanModel.kpiStatusRede().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiQtdMaquinasInstaveis(req, res) {
    ryanModel.kpiQtdMaquinasInstaveis().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiHoraMelhorAcesso(req, res) {
    ryanModel.kpiHoraMelhorAcesso().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function listarMaquinasEstados(req, res) {
    ryanModel.listarMaquinasEstados().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

module.exports = {
    kpiStatusRede,
    kpiQtdMaquinasInstaveis,
    kpiHoraMelhorAcesso,
    listarMaquinasEstados
}