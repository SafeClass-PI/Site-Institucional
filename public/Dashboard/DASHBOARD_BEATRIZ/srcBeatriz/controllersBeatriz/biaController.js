var biaModel = require("../modelsBeatriz/biaModels");


function buscarQtdSolicitacoesDiarias(req, res) {
    biaModel.buscarQtdSolicitacoesDiarias()
        .then(resultado => res.status(200).json(resultado[0]))
        .catch(erro => {
            console.error("Erro ao buscar solicitações diárias:", erro);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}


function listarUsuariosOnline(req, res) {
    biaModel.listarUsuariosOnline()
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("Erro ao listar usuários online:", erro);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}


function totalUsuarios(req, res) {
    biaModel.totalUsuarios()
        .then(resultado => res.status(200).json({ totalUsuarios: resultado[0].qtd }))
        .catch(erro => {
            console.error("Erro ao buscar total de usuários:", erro);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}


function marcarOnline(req, res) {
    const { idUsuario } = req.body;
    biaModel.marcarOnline(idUsuario)
        .then(resultado => res.status(200).json({ success: true, resultado }))
        .catch(erro => {
            console.error("Erro ao marcar usuário online:", erro);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

function registrarLogin(req, res) {
    const { idUsuario } = req.body;
    biaModel.registrarLogin(idUsuario)
        .then(resultado => res.status(200).json({ success: true, resultado }))
        .catch(erro => {
            console.error("Erro ao registrar login:", erro);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

function buscarHoraMaisAcessada(req, res) {
    biaModel.horaMaisAcessada()
        .then(resultado => res.status(200).json(resultado[0] || { hora: null, total: 0 }))
        .catch(erro => {
            console.error("Erro ao buscar horário mais acessado:", erro);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

module.exports = {
    buscarQtdSolicitacoesDiarias,
    listarUsuariosOnline,
    totalUsuarios,
    marcarOnline,
    registrarLogin,
    buscarHoraMaisAcessada
};
