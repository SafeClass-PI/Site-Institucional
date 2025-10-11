var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email) {
        res.status(400).send("Seu email está undefined!");
    } else if (!senha) {
        res.status(400).send("Sua senha está undefined!");
    } else {
        usuarioModel.autenticar(email, senha)
            .then(usuario => {
                // Login permitido
                res.json({ success: true, usuario: usuario });
            })
            .catch(erro => {
                // Aqui envia a mensagem de erro para o frontend
                console.log("Erro no login:", erro.message);
                res.json({ success: false, mensagem: erro.message });
            });
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cargo_tipo = req.body.tipo_cargoServer;

    if (!nome) {
        res.status(400).send("Seu nome está undefined!");
    } else if (!email) {
        res.status(400).send("Seu email está undefined!");
    } else if (!senha) {
        res.status(400).send("Sua senha está undefined!");
    } else if (!cargo_tipo) {
        res.status(400).send("Seu cargo está undefined!");
    } else {
        usuarioModel.cadastrar(cargo_tipo, nome, email, senha)
            .then(resultado => {
                res.json({ success: true });
            })
            .catch(erro => {
                console.log("Erro no cadastro:", erro.message);
                res.json({ success: false, mensagem: erro.message });
            });
    }
}

module.exports = {
    autenticar,
    cadastrar
};
