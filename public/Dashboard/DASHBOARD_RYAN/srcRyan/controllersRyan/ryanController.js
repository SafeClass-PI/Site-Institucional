var ryanModel = require("../modelsRyan/ryanModel");


function carregarSalas(req, res) {
    ryanModel.carregarSalas().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

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

function obterDadosGraficoPing(req, res) {
    ryanModel.obterDadosGraficoPing().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function obterDadosGraficoPingUltimo(req, res) {
    ryanModel.obterDadosGraficoPingUltimo().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function graficoSemana(req, res) {
    ryanModel.graficoSemana().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function carregarDadosPrevisao(req, res) {
    ryanModel.carregarDadosPrevisao().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}


module.exports = {
    carregarSalas,
    kpiStatusRede,
    kpiQtdMaquinasInstaveis,
    kpiHoraMelhorAcesso,
    listarMaquinasEstados,
    obterDadosGraficoPing,
    obterDadosGraficoPingUltimo,
    graficoSemana,
    carregarDadosPrevisao
}