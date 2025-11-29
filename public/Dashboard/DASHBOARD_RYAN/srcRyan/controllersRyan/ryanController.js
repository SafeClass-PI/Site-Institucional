var ryanModel = require("../modelsRyan/ryanModel");

function carregarSalas(req, res) {
    ryanModel.carregarSalas().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiStatusRede(req, res) {
    const idSala = req.params.idSala;

    ryanModel.kpiStatusRede(idSala).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiQtdMaquinasInstaveis(req, res) {
    const idSala = req.params.idSala;

    ryanModel.kpiQtdMaquinasInstaveis(idSala).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function kpiHoraMelhorAcesso(req, res) {
    const idSala = req.params.idSala;
    ryanModel.kpiHoraMelhorAcesso(idSala).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function listarMaquinasEstados(req, res) {
    const idSala = req.params.idSala;
    ryanModel.listarMaquinasEstados(idSala).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function obterDadosGraficoPing(req, res) {
    const idSala = req.params.idSala;
    ryanModel.obterDadosGraficoPing(idSala).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function obterDadosGraficoPingUltimo(req, res) {
    const idSala = req.params.idSala;
    ryanModel.obterDadosGraficoPingUltimo(idSala).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function graficoSemana(req, res) {
    const idSala = req.params.idSala;

    ryanModel.graficoSemana(idSala).then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

function carregarDadosPrevisao(req, res) {
    const idSala = req.params.idSala;

    ryanModel.carregarDadosPrevisao(idSala).then(function (resultado) {
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