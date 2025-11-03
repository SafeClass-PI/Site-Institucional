import usuarioModel from "../models/usuarioModel.js";  // ⚠ lembre do .js
import { enviarEmailAprovacao, enviarEmailRejeicao, enviarEmailRecuperacao, enviarEmailCadastroPendente } from "../services/emailService.js";





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
                res.json({
                    success: true,
                    usuario: {
                        idUsuario: usuario.idUsuario,
                        nome: usuario.nome,
                        email: usuario.email,
                        cargo: usuario.cargo,
                        status: usuario.status,
                        dtCadastro: usuario.dtCadastro
                    }
                });
            })

            .catch(erro => {
                // Aqui envia a mensagem de erro para o frontend
                console.log("Erro no login:", erro.message);
                res.json({ success: false, mensagem: erro.message });
            });
    }
}

async function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cargo_tipo = req.body.tipo_cargoServer;

    if (!nome) {
        res.status(400).send("Seu nome está undefined!");
        return;
    }
    if (!email) {
        res.status(400).send("Seu email está undefined!");
        return;
    }
    if (!senha) {
        res.status(400).send("Sua senha está undefined!");
        return;
    }
    if (!cargo_tipo) {
        res.status(400).send("Seu cargo está undefined!");
        return;
    }

    try {
        const resultado = await usuarioModel.cadastrar(cargo_tipo, nome, email, senha);

        // Depois pega o id do usuário recém cadastrado
        const idUsuario = resultado.insertId; // ou como retorna do seu INSERT

        // Pega o nome do gestor
        const nomeGestor = await usuarioModel.buscarGestorPorUsuario(idUsuario);

        // Envia o e-mail com o nome do gestor
        await enviarEmailCadastroPendente(email, nome, nomeGestor);



        res.json({ success: true, message: "Cadastro realizado! Aguarde a aprovação do gestor." });

    } catch (erro) {
        console.error("Erro no cadastro:", erro.message);
        res.json({ success: false, mensagem: erro.message });
    }

}


function cadastrarGestor(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cargo_tipo = req.body.tipo_cargoServer;
    var status = req.body.statusServer;

    if (!nome) {
        res.status(400).send("Seu nome está undefined!");
    } else if (!email) {
        res.status(400).send("Seu email está undefined!");
    } else if (!senha) {
        res.status(400).send("Sua senha está undefined!");
    } else if (!cargo_tipo) {
        res.status(400).send("Seu cargo está undefined!");
    } else {
        usuarioModel.cadastrarGestor(cargo_tipo, nome, email, senha, status)
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


function buscarqtdSolicitacoes(req, res) {
    usuarioModel.buscarqtdSolicitacoes().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    })
}

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
    var userId = req.params.id;

    if (!userId) {
        res.status(400).send("ID do usuário está faltando!");
    } else {
        usuarioModel.aprovar(userId)
            .then(async resultado => {
                if (resultado.affectedRows > 0) {
                    var usuario = await usuarioModel.buscarPorId(userId);

                    // ✅ Envia o e-mail de aprovação
                    await enviarEmailAprovacao(usuario.email, usuario.nome);

                    res.json({ success: true, message: "Usuário aprovado com sucesso e e-mail enviado!" });

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
    var userId = req.params.id;

    if (!userId) {
        res.status(400).send("ID do usuário está faltando!");
    } else {
        usuarioModel.buscarPorId(userId)
            .then(usuario => {
                if (!usuario) {
                    return res.status(404).json({ success: false, message: "Usuário não encontrado." });
                }

                // Envia o e-mail de rejeição
                return enviarEmailRejeicao(usuario.email, usuario.nome)
                    .then(() => {
                        // Após enviar o e-mail, exclui o usuário
                        return usuarioModel.rejeitar(userId);
                    });
            })
            .then(resultado => {
                if (resultado.affectedRows > 0) {
                    res.json({ success: true, message: "Solicitação rejeitada, e-mail enviado e usuário deletado." });
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


function gerarSenhaTemporaria() {
    return Math.random().toString(36).slice(-8); // Ex: "a9xk2b1z"
}

async function recuperarSenha(req, res) {
    const email = req.body.emailServer;

    if (!email) {
        return res.status(400).json({ success: false, message: "E-mail não fornecido." });
    }

    try {
        const usuario = await usuarioModel.buscarPorEmail(email);

        if (!usuario) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado." });
        }

        const novaSenha = gerarSenhaTemporaria();
        console.log("Senha gerada e enviada:", novaSenha);


        const expiraEm = new Date(Date.now() + 10 * 60000); // 10 minutos

        await usuarioModel.atualizarSenhaTemporaria(usuario.idUsuario, novaSenha, expiraEm);
        await enviarEmailRecuperacao(email, usuario.nome, novaSenha);

        res.json({ success: true, message: "Nova senha enviada para o e-mail." });
    } catch  {
       console.log("Erro na recuperação de senha")
    }
}


async function alterarSenhaPerfil(req, res) {
    const idUsuario = req.params.id;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ success: false, message: "Campos obrigatórios não preenchidos." });
    }

    try {
        const usuario = await usuarioModel.buscarPorId(idUsuario);

        if (!usuario) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado." });
        }

        if (usuario.senha !== senhaAtual) {
            console.log("Senha digitada:", senhaAtual);
            console.log("Senha no banco:", usuario.senha);

            return res.status(401).json({ success: false, message: "Senha atual incorreta." });
        }

        await usuarioModel.atualizarSenha(idUsuario, novaSenha);
        res.json({ success: true, message: "Senha atualizada com sucesso." });
    } catch (erro) {
        console.error("Erro ao alterar senha:", erro.message);
        res.status(500).json({ success: false, message: "Erro interno ao alterar senha." });
    }
}



function buscarTodos(req, res) {
    usuarioModel.buscarTodos()
        .then(resultado => {
            res.status(200).json(resultado);
        })
        .catch(erro => {
            console.error("Erro ao buscar todos os usuários:", erro);
            res.status(500).json(erro);
        });
}

function deletarUsuario(req, res) {
    const idUsuario = req.params.id;

    if (!idUsuario) {
        return res.status(400).json({ success: false, message: "ID do usuário não informado." });
    }

    usuarioModel.deletar(idUsuario)
        .then(resultado => {
            if (resultado.affectedRows > 0) {
                res.json({ success: true, message: "Usuário deletado com sucesso." });
            } else {
                res.status(404).json({ success: false, message: "Usuário não encontrado." });
            }
        })
        .catch(erro => {
            console.error("Erro ao deletar usuário:", erro.message);
            res.status(500).json({ success: false, message: "Erro interno ao deletar usuário." });
        });
}


function efetuarEdicaoUser() {
    const nome = document.querySelector("#modalEditarUsuario input[placeholder='Novo nome']").value;
    const email = document.querySelector("#modalEditarUsuario input[placeholder='Novo E-mail']").value;
    const cargo = document.querySelector("#modalEditarUsuario select").value;
    const status = document.getElementById("editarStatusUsuario").value === "user-ativo" ? "ativo" : "inativo";

    fetch(`/api/usuarios/usuario/${usuarioEditandoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email, cargo, status })
    })
    .then(res => res.json())
    .then(resposta => {
        if (resposta.success) {
            alert("Usuário atualizado com sucesso!");
            cancelarEditarUser();
            listarUsuarios();
        } else {
            alert("Erro ao atualizar: " + resposta.message);
        }
    })
    .catch(erro => {
        console.error("Erro ao atualizar usuário:", erro);
        alert("Erro interno ao atualizar.");
    });
}

function atualizarUsuario(req, res) {
    const idUsuario = req.params.id;
    const { nome, email, cargo, status } = req.body;

    if (!nome || !email || !cargo || !status) {
        return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios." });
    }

    usuarioModel.atualizarUsuario(idUsuario, nome, email, cargo, status)
        .then(resultado => {
            if (resultado.affectedRows > 0) {
                res.json({ success: true, message: "Usuário atualizado com sucesso." });
            } else {
                res.status(404).json({ success: false, message: "Usuário não encontrado." });
            }
        })
        .catch(erro => {
            console.error("Erro ao atualizar usuário:", erro.message);
            res.status(500).json({ success: false, message: "Erro interno ao atualizar usuário." });
        });
}
function buscarUsuarioPorId(req, res) {
    const idUsuario = req.params.id;

    usuarioModel.buscarPorId(idUsuario)
        .then(usuario => {
            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ success: false, message: "Usuário não encontrado." });
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar usuário por ID:", erro.message);
            res.status(500).json({ success: false, message: "Erro interno ao buscar usuário." });
        });
}






export {
    autenticar,
    cadastrar,
    cadastrarGestor,
    buscarqtdSolicitacoes,
    getSolicitacoes,
    aprovarUsuario,
    rejeitarUsuario,
    recuperarSenha,
    alterarSenhaPerfil,
    buscarTodos,
    deletarUsuario,
    atualizarUsuario,
    efetuarEdicaoUser,
    buscarUsuarioPorId
};

