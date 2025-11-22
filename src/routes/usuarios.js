var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

// Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/cadastrarPorGestor", function (req, res) {
    usuarioController.cadastrarGestor(req, res);
})

// ------------------------------------------------------------------
// NOVAS ROTAS PARA O MODAL DE SOLICITAÇÕES
// ------------------------------------------------------------------

router.get("/qtdSolicitacoes/", function (req, res) {
    usuarioController.buscarqtdSolicitacoes(req, res);
});

// 1. Rota para carregar os dados no modal (GET)
// Chama a função que busca todos os usuários com status 'pendente'
router.get('/solicitacoes', function (req, res) {
    usuarioController.getSolicitacoes(req, res);
});

// 2. Rota para aprovar o usuário (PUT - para atualizar o status)
// O :id é o idUsuario que será aprovado
router.put('/aprovar/:id', function (req, res) {
    usuarioController.aprovarUsuario(req, res);
});

// 3. Rota para rejeitar o usuário (DELETE - para excluir o registro)
// O :id é o idUsuario que será rejeitado (excluído)
router.delete('/rejeitar/:id', function (req, res) {
    usuarioController.rejeitarUsuario(req, res);
});


// 4. Rota para buscar um usuário específico pelo ID
router.get('/usuario/:id', function (req, res) {
    usuarioController.buscarUsuarioPorId(req, res);
});

router.post("/recuperar-senha", function (req, res) {
    usuarioController.recuperarSenha(req, res);
});

router.put("/alterar-senha/:id", function (req, res) {
  usuarioController.alterarSenhaPerfil(req, res);
});

router.get("/usuarios", function (req, res) {
    usuarioController.buscarTodos(req, res);
});

router.get("/", function (req, res) {
    usuarioController.buscarTodos(req, res);
});

router.delete("/usuario/:id", function (req, res) {
    usuarioController.deletarUsuario(req, res);
});

router.put("/usuario/:id", function (req, res) {
    usuarioController.atualizarUsuario(req, res);
});
router.get('/usuario/:id', function (req, res) {
    usuarioController.buscarUsuarioPorId(req, res);
});

router.get('/exportarCSV', usuarioController.exportarCSV);

module.exports = router;