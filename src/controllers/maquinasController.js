const maquinasModel = require("../models/maquinasModel");

async function cadastrarMaquina(req, res) {
    try {
        const { sala, so, ip, username, senha, disco, ram, cpu } = req.body;

        // Verificação básica dos campos
        if (!sala || !so || !ip || !username || !senha || !disco || !ram || !cpu) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
        }

        // Cadastra a máquina e retorna o resultado
        const resultado = await maquinasModel.cadastrarMaquinaComComponentes(sala, so, ip, username, senha, disco, ram, cpu);

        // resultado.insertId retorna o ID gerado no MySQL
        res.status(201).json({
            mensagem: "Máquina e componentes cadastrados com sucesso!",
            fkMaquina: resultado.insertId
        });
    } catch (erro) {
        console.error("Erro ao cadastrar máquina:", erro);
        res.status(500).json({ erro: "Erro ao cadastrar a máquina." });
    }
}

function listar(req, res) {
    maquinasModel.listar()
        .then(resultado => {
            res.status(200).json(resultado);
        })
        .catch(erro => {
            console.error("Erro ao listar máquinas:", erro);
            res.status(500).json({ erro: "Erro interno ao listar máquinas." });
        });
}

module.exports = {
    cadastrarMaquina,
    listar
};
