
var maquinasModel = require("../models/maquinasModel");

function cadastrarMaquina(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var username = req.body.username; // ou UsernameServer
    var ip = req.body.ip;             // IPServer
    var so = req.body.so;             // SOServer
    var senha = req.body.senha;       // SenhaServer
    var sala = req.body.sala;         // SalaServer


   if (!username) return res.status(400).send("Seu username está undefined!");
    if (!ip) return res.status(400).send("Seu IP está undefined!");
    if (!so) return res.status(400).send("Seu sistema operacional está undefined!");
    if (!senha) return res.status(400).send("Sua senha está undefined!");
    if (!sala) return res.status(400).send("Sua sala está undefined!");

    maquinasModel.cadastrarMaquina(sala, so, ip, username, senha)
    .then(resultado => res.json(resultado))
    .catch(erro => {
        console.error(erro);
        res.status(500).json({ erro: erro.sqlMessage });
    });
}




function listar(req, res) {
    maquinasModel.listar()
        .then(resultado => {
            res.status(200).json(resultado); // envia idMaquina e marca
        })
        .catch(erro => {
            console.error("Erro ao listar máquinas:", erro);
            res.status(500).json({
                success: false,
                mensagem: "Erro interno ao listar máquinas."
            });
        });
}




module.exports = {
    cadastrarMaquina,
    listar
}