// controllersFelipe/cpuMaxController.js

const cpuMaxModel = require("../modelsFelipe/cpuMaxModels");

function getMaquinaCritica(req, res) {
    // 1. CAPTURAR O ID DA SALA DOS PARÂMETROS
    const idSala = req.params.idSala; 

    if (!idSala || idSala === 'undefined') {
        res.status(400).send("O ID da Sala é obrigatório para buscar a máquina crítica!");
        return;
    }

    // 2. PASSAR O ID DA SALA PARA A FUNÇÃO DO MODEL
    cpuMaxModel.buscarMaquinaCriticaPorSala(idSala)
        .then(resultado => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(200).json([]); // Retorna array vazio se não houver dados
            }
        })
        .catch(erro => {
            console.error(`Erro ao buscar máquina crítica: ${erro.sqlMessage}`);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    getMaquinaCritica
};