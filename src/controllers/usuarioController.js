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

// ------------------------------------------------------------------
// NOVAS FUNÇÕES PARA O MODAL DE SOLICITAÇÕES
// ------------------------------------------------------------------

function getSolicitacoes(req, res) {
    // Não precisamos de validação aqui, apenas buscar
    usuarioModel.buscarPendentes()
        .then(solicitacoes => {
            // Retorna a lista de usuários pendentes como um JSON Array
            res.status(200).json(solicitacoes); 
        })
        .catch(erro => {
            console.error("Erro ao buscar solicitações:", erro.message);
            res.status(500).json({ success: false, mensagem: "Erro interno ao buscar solicitações." });
        });
}

function aprovarUsuario(req, res) {
    // O ID do usuário vem dos parâmetros da rota (ex: /aprovar/5)
    var userId = req.params.id; 
    
    if (!userId) {
        res.status(400).send("ID do usuário está faltando!");
    } else {
        usuarioModel.aprovar(userId)
            .then(resultado => {
                // Checa se alguma linha foi realmente alterada (opcional, mas bom)
                if (resultado.affectedRows > 0) { 
                    res.json({ success: true, message: "Usuário aprovado com sucesso!" });
                } else {
                     res.status(404).json({ success: false, message: "Usuário não encontrado ou já ativo." });
                }
            })
            .catch(erro => {
                console.error("Erro ao aprovar usuário:", erro.message);
                res.status(500).json({ success: false, mensagem: "Erro ao aprovar. Verifique o console do servidor." });
            });
    }
}

function rejeitarUsuario(req, res) {
    // O ID do usuário vem dos parâmetros da rota (ex: /rejeitar/5)
    var userId = req.params.id;
    
    if (!userId) {
        res.status(400).send("ID do usuário está faltando!");
    } else {
        usuarioModel.rejeitar(userId)
            .then(resultado => {
                if (resultado.affectedRows > 0) {
                    // Se a exclusão foi bem sucedida
                    res.json({ success: true, message: "Solicitação rejeitada e usuário deletado." });
                } else {
                    res.status(404).json({ success: false, message: "Usuário não encontrado." });
                }
            })
            .catch(erro => {
                console.error("Erro ao rejeitar usuário:", erro.message);
                res.status(500).json({ success: false, mensagem: "Erro ao rejeitar. Verifique o console do servidor." });
            });
    }
}


module.exports = {
    autenticar,
    cadastrar,
    getSolicitacoes,    // Adicionado
    aprovarUsuario,     // Adicionado
    rejeitarUsuario     // Adicionado
};