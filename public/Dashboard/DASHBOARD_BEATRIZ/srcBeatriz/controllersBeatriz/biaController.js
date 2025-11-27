var biaModel = require("../modelsBeatriz/biaModels");

function buscarQtdSolicitacoesDiarias(req, res) {
    biaModel.buscarQtdSolicitacoesDiarias()
        .then(function(resultado) {
            res.status(200).json(resultado[0]); 
        })
        .catch(function(erro) {
            console.error("Erro ao buscar solicitações diárias:", erro);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

module.exports = {
    buscarQtdSolicitacoesDiarias
};
