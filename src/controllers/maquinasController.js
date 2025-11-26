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



async function listarMaquinas(req, res) {
    const { pagina = 1, limite = 8, estado } = req.query;

    try {
        const resultado = await maquinasModel.listarMaquinas(pagina, limite, estado);
        res.json(resultado);
    } catch (erro) {
        console.error("Erro ao listar máquinas:", erro);
        res.status(500).json({ erro: "Erro ao listar máquinas" });
    }
}




const { Parser } = require('json2csv'); // instalar: npm install json2csv

async function exportarCSV(req, res) {
    try {
        const limite = 1000;
        const offset = 0;
        const maquinas = await maquinasModel.listarMaquinas(limite, offset);

        const campos = [
            'identificacao',
            'nome_maquina',
            'estado',
            'localizacao',
            'so',
            'ipv4',
            'cpu_capacidade',
            'ram_capacidade',
            'disco_capacidade'
        ];

        const parser = new Parser({ fields: campos });
        const csv = parser.parse(maquinas);

        res.header('Content-Type', 'text/csv');
        res.attachment('maquinas.csv');
        res.send(csv);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao gerar CSV');
    }
}


function obterPorId(req, res) {
    const idMaquina = req.params.id;
    maquinasModel.obterPorId(idMaquina)
        .then(resultado => {
            if (!resultado) {
                return res.status(404).json({ erro: "Máquina não encontrada" });
            }
            res.status(200).json(resultado);
        })
        .catch(erro => {
            res.status(500).json({ erro: erro.sqlMessage || "Erro ao obter máquina" });
        });
}

function atualizar(req, res) {
    const idMaquina = req.params.id;
    const { fkSala, sistemaOperacional } = req.body;

    if (!fkSala || !sistemaOperacional) {
        return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    maquinasModel.atualizar(idMaquina, fkSala, sistemaOperacional)
        .then(resultado => {
            res.status(200).json({ mensagem: "Máquina atualizada com sucesso" });
        })
        .catch(erro => {
            res.status(500).json({ erro: erro.sqlMessage || "Erro ao atualizar máquina" });
        });
}

function deletar(req, res) {
    const idMaquina = req.params.id;
    maquinasModel.deletar(idMaquina)
        .then(() => {
            res.status(200).json({ mensagem: "Máquina deletada com sucesso" });
        })
        .catch(erro => {
            res.status(500).json({ erro: erro.sqlMessage || "Erro ao deletar máquina" });
        });
}




module.exports = {
    cadastrarMaquina,
    listar,
    listarMaquinas,
    exportarCSV,
    obterPorId,
    atualizar,
    deletar
};
