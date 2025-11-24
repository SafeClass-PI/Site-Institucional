var alertasModel = require("../models/alertasModel");


async function listarAlertas(req, res) {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 8;
    const offset = (pagina - 1) * limite;

    try {
        const resultados = await alertasModel.listarAlertas(limite, offset);
        res.json(resultados);
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
        const maquinas = await alertasModel.listarAlertas(limite, offset);

        const campos = [
            'identificacao',
            'componente',
            'mensagem',
            'nivel',
            'localizacao',
            'hora'
        ];

        const parser = new Parser({ fields: campos });
        const csv = parser.parse(maquinas);

        res.header('Content-Type', 'text/csv');
        res.attachment('alertas.csv');
        res.send(csv);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao gerar CSV');
    }
}

function qtdPaginas(req, res) {
    alertasModel.qtdPaginas().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}


module.exports = {
    listarAlertas,
    exportarCSV,
    qtdPaginas
}