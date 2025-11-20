    var salasModel = require("../models/salasModel");

    function listar(req, res) {

        salasModel.listar()
            .then(resultado => {
                res.status(200).json(resultado);
            })
            .catch(erro => {
                console.error("Erro ao listar salas:", erro.message);
                res.status(500).json({
                    success: false,
                    mensagem: "Erro interno ao listar salas."
                });
            });
    }

    module.exports = {
        listar
    };
