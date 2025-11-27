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

module.exports = {
    kpiStatusRede,
    kpiQtdMaquinasInstaveis
}