
const cpuMaxModel = require("../modelsFelipe/cpuMaxModels");

function getMaquinaCritica(req, res) {
    const idSala = req.params.idSala; 

    if (!idSala || idSala === 'undefined') {
        res.status(400).send("O ID da Sala é obrigatório para buscar a máquina crítica!");
        return;
    }

    cpuMaxModel.buscarMaquinaCriticaPorSala(idSala)
        .then(resultado => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(200).json([]); 
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