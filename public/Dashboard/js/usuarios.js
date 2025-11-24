document.addEventListener("DOMContentLoaded", function () {
    carregarInfos();
});

function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;

    var imgPerfil = document.getElementById('imgPerfil');

    if (imgPerfil) {
        if (sessionStorage.IMAGEM_USUARIO && sessionStorage.IMAGEM_USUARIO.trim() !== "") {
            imgPerfil.src = `/uploads/${sessionStorage.IMAGEM_USUARIO}`;
        } else {
            imgPerfil.src = 'imgs/profile-default.webp';
        }
    }
    
    quantidadeSolicitacoes();
    listarUsuarios();
}

document.getElementById("exportarDados").addEventListener("click", () => {
    window.location.href = "/api/usuarios/exportarCSV";
});

let usuarioEditandoId = null;


function sairDaPagina() {
    modalLogout.style.display = 'flex';
    telaOverlay.style.display = 'block';
}

function cancelarSairDaPagina() {
    modalLogout.style.display = 'none';
    telaOverlay.style.display = 'none';
}

function confirmarSairDaPagina() {
    window.location.href = '../index.html'
}

const telaOverlay = document.getElementById('telaOverlay');
const modalDeletarUsuario = document.getElementById('modalDeletarUsuario');
const modalSolicitacoes = document.getElementById('modalSolicitacoes');
const modalAdicionarUser = document.getElementById('modalAdicionarUser'); // Adicionado
const modalEditarUsuario = document.getElementById('modalEditarUsuario'); // Adicionado

const tbodySolicitacoes = modalSolicitacoes ? modalSolicitacoes.querySelector('tbody') : null;

function adicionarUsuario() {
    telaOverlay.style.display = 'block'
    modalAdicionarUser.style.display = 'flex';
}

function cancelarAdicionarUser() {
    telaOverlay.style.display = 'none';
    modalAdicionarUser.style.display = 'none';
}

function efetuarCriacaoUser() {
    alert('Usuário criado com sucesso!');
    telaOverlay.style.display = 'none';
    modalAdicionarUser.style.display = 'none';

}

function deletarUsuario() {
    telaOverlay.style.display = 'block';
    modalDeletarUsuario.style.display = 'flex';
}

function cancelarExclusaoUser() {
    telaOverlay.style.display = 'none';
    modalDeletarUsuario.style.display = 'none';
}

function confirmarExclusaoUser() {
    alert('Usuário deletado com sucesso!');
    telaOverlay.style.display = 'none';
    modalDeletarUsuario.style.display = 'none';
}

function editarUsuario() {
    telaOverlay.style.display = 'block';
    modalEditarUsuario.style.display = 'flex';
}

const editarStatusUsuario = document.getElementById('editarStatusUsuario');

function atualizarCorSelect() {
    const valor = editarStatusUsuario.value;

    if (valor === "user-ativo") {
        editarStatusUsuario.style.backgroundColor = " var(--cor-estavel)";
        editarStatusUsuario.style.color = "white";
    }
    else if (valor === "user-inativo") {
        editarStatusUsuario.style.backgroundColor = "var(--cor-critico)";
        editarStatusUsuario.style.color = "white";
    }
    else {
        editarStatusUsuario.style.backgroundColor = "";
        editarStatusUsuario.style.color = "";
    }
}

if (editarStatusUsuario) {
    editarStatusUsuario.addEventListener("change", atualizarCorSelect);
    atualizarCorSelect();
}


function cancelarEditarUser() {
    telaOverlay.style.display = 'none';
    modalEditarUsuario.style.display = 'none';
}

function efetuarEdicaoUser() {
    alert('Usuário editado com sucesso!');
    telaOverlay.style.display = 'none';
    modalEditarUsuario.style.display = 'none';
}


// ======================================================================
// FUNÇÕES DE SOLICITAÇÃO (CÓDIGO DE SOLICITAÇÃO CORRIGIDO)
// ======================================================================

function abrirSolicitacoes() {
    if (modalSolicitacoes) {
        modalSolicitacoes.style.display = 'block';
        telaOverlay.style.display = 'block';
        // 🚨 CHAMA A FUNÇÃO QUE BUSCA OS DADOS NO BACKEND
        carregarSolicitacoes();
    }
}

function fecharSolicitacoes() {
    if (modalSolicitacoes) {
        modalSolicitacoes.style.display = 'none';
        telaOverlay.style.display = 'none';
    }
}

/**
 * Busca a lista de usuários pendentes no backend e preenche a tabela do modal.
 */

function quantidadeSolicitacoes() {
    fetch(`/api/usuarios/qtdSolicitacoes`, { cache: 'no-store' }).then(function (response) {
        var vt_alertas = [];

        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                vt_alertas = resposta;
                var msg = document.getElementById("qtdSolicitacoes")

                msg.innerHTML = `${vt_alertas[0].qtdSolicitacoes}`;
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });

}

function carregarSolicitacoes() {
    if (!tbodySolicitacoes) return;

    // Limpa o conteúdo estático do HTML antes de carregar
    tbodySolicitacoes.innerHTML = '<tr><td colspan="4">Carregando solicitações...</td></tr>';

    // Rota: GET /api/usuarios/solicitacoes
    fetch("/api/usuarios/solicitacoes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Erro de rede ou servidor'); });
            }
            return response.json();
        })
        .then(solicitacoes => {
            tbodySolicitacoes.innerHTML = ''; // Limpa o "Carregando"

            if (solicitacoes.length === 0) {
                tbodySolicitacoes.innerHTML = '<tr><td colspan="4">Não há novas solicitações de cadastro.</td></tr>';
                // Você pode atualizar o contador do botão "Solicitações" aqui
                return;
            }

            solicitacoes.forEach(solicitacao => {
                const row = document.createElement('tr');

                // solicitacao.idUsuario é o ID que veio do banco e será usado nas funções de ação
                row.innerHTML = `
                <td>${solicitacao.nome}</td>
                <td>${solicitacao.email}</td>
                <td>${solicitacao.emissao}</td>
                <td>
                    <button class="btn-aprovar" title="Aprovar Usuário" onclick="manipularSolicitacao(${solicitacao.idUsuario}, 'aprovar')">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    <button class="btn-rejeitar" title="Rejeitar e Excluir" onclick="manipularSolicitacao(${solicitacao.idUsuario}, 'rejeitar')">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </td>
            `;
                tbodySolicitacoes.appendChild(row);
            });

            // Atualiza o contador do botão
            // document.querySelector('.icone-qtd-solicitacoes p').innerText = solicitacoes.length; 
        })
        .catch(error => {
            console.error("Erro no carregamento das solicitações:", error);
            tbodySolicitacoes.innerHTML = `<tr><td colspan="4">Erro ao carregar: ${error.message}</td></tr>`;
        });
}

/**
 * Envia o comando de aprovação (PUT) ou rejeição (DELETE) para o backend.
 */
function manipularSolicitacao(idUsuario, acao) {
    let method;
    let url;
    let confirmMessage;
    let successMessage;

    if (acao === 'aprovar') {
        method = 'PUT';
        url = `/api/usuarios/aprovar/${idUsuario}`;
        confirmMessage = 'Confirma a aprovação deste usuário? Ele terá acesso imediato.';
        successMessage = 'Usuário APROVADO com sucesso!';
        window.location.reload();
    } else if (acao === 'rejeitar') {
        method = 'DELETE';
        url = `/api/usuarios/rejeitar/${idUsuario}`;
        confirmMessage = 'Confirma a rejeição? O cadastro será permanentemente DELETADO.';
        successMessage = 'Solicitação REJEITADA e excluída!';
    } else {
        return;
    }

    if (!confirm(confirmMessage)) {
        return;
    }

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            // Trata a resposta do backend
            if (response.status === 200) { // status 200 é o esperado para sucesso
                return response.json();
            }
            // Tenta ler o JSON de erro do backend se o status não for 200
            return response.json().then(errorData => {
                // Lança um erro mais detalhado se o backend retornou mensagem
                throw new Error(errorData.mensagem || `Erro ${response.status} ao processar a solicitação.`);
            }).catch(() => {
                // Se não conseguir ler JSON (ex: erro 500 sem corpo)
                throw new Error(`Erro ${response.status} ao processar a solicitação.`);
            });
        })
        .then(data => {
            alert(successMessage);
            // Após a ação, recarrega a lista para remover o item processado
            carregarSolicitacoes();
        })
        .catch(error => {
            console.error(`Erro ao ${acao} usuário:`, error);
        });
}



/* --------------------- GESTOR ADICIONAR NOVO USER -------------------------------------- */

function efetuarCriacaoUserGestor() {
    var emailUsuario = emailNovoUser.value;
    var senhaUsuario = senhaNovoUser.value;
    var nomeUsuario = nomeNovoUser.value;
    var cargoUser = cargoNovoUser.value;
    var statusUser = "ativo";

    if (emailUsuario == "" || senhaUsuario == "" || nomeUsuario == "" || cargoUser == "") {
        alert('Insira todos os dados pedidos!')
    }
    else {
        fetch("/api/usuarios/cadastrarPorGestor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeServer: nomeUsuario,
                emailServer: emailUsuario,
                senhaServer: senhaUsuario,
                tipo_cargoServer: cargoUser,
                statusServer: statusUser
            }),
        })
            .then(function (resposta) {
                if (resposta.ok) {
                    return resposta.json();
                } else {
                    // Captura erros HTTP (400, 500)
                    resposta.json().then(error => {
                        alert("Erro ao cadastrar: " + (error.mensagem || 'Erro desconhecido.'));
                        throw new Error('Erro ao cadastrar. Status: ' + resposta.status);
                    });
                }
            })
            .then(resposta => {
                if (resposta.success) {
                    alert("Cadastro realizado com sucesso!");
                    window.location.reload();
                    emailNovoUser.value = "";
                    senhaNovoUser.value = "";
                    nomeNovoUser.value = "";
                    cargoNovoUser.value = "";

                    cancelarAdicionarUser();
                } else {
                    alert("Erro ao cadastrar: " + resposta.mensagem);
                }
            })

            .catch(function (erro) {
                console.error("Erro no fetch de cadastro:", erro);
            });
    }
}

let paginaAtual = 1;
const limite = 5;
let termoBuscaAtual = "";
async function listarUsuarios(pagina = 1, busca = termoBuscaAtual, cargo = "", status = "") {
    try {
        paginaAtual = pagina;
        const resposta = await fetch(
            `/api/usuarios?pagina=${pagina}&limite=${limite}&search=${encodeURIComponent(busca)}&cargo=${encodeURIComponent(cargo)}&status=${encodeURIComponent(status)}`,
            { cache: "no-store" }
        );
        const usuarios = await resposta.json();

        const tbody = document.getElementById("tabelaUsuarios");
        tbody.innerHTML = "";

        usuarios.forEach(u => {
            const tr = document.createElement("tr");
            const statusClass = u.status.toLowerCase() === "ativo" ? "status-ativo" : "status-inativo";
            const caminhoImagem = u.imagem ? `./uploads/${u.imagem}` : `/uploads/profile-default.webp`;
            
            tr.innerHTML = `
                        <td>
                            <div class="usuario-info">
                                <div class="imagem-perfil">
                                   <img src="${caminhoImagem}" alt="Foto de ${u.nomeUsuario}">
                                </div>
                                <p>${u.nomeUsuario}</p>
                            </div>
                        </td>
                        <td><p>${u.email}</p></td>
                        <td><p>${u.cargo}</p></td>
                        <td><p>${formatarData(u.dtCadastro)}</p></td>
                        <td><span class="${statusClass}">${u.status}</span></td>
                        <td>
                            <button onclick="editarUsuario(${u.idUsuario})"><i class="fa-solid fa-pencil"></i></button>
                            <button onclick="deletarUsuario(${u.idUsuario})"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    `;
            tbody.appendChild(tr);
        });

        atualizarBotoesPaginacao();

    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
    }
}

document.getElementById("inputBuscaUsuarios").addEventListener("input", function () {
    termoBuscaAtual = this.value.trim(); // 👈 salva o termo
    listarUsuarios(1, termoBuscaAtual);  // 👈 usa o termo salvo
});


function atualizarBotoesPaginacao() {
    const btnPrev = document.querySelector(".prev");
    const btnNext = document.querySelector(".next");
    const paginas = document.querySelectorAll(".pagina");

    btnPrev.disabled = paginaAtual === 1;

    const totalPaginas = paginas.length;
    btnNext.disabled = paginaAtual === totalPaginas;

    paginas.forEach((btn, index) => {
        btn.classList.toggle("ativa", index + 1 === paginaAtual);
        btn.onclick = () => listarUsuarios(index + 1);
    });

    btnPrev.onclick = () => listarUsuarios(paginaAtual - 1);
    btnNext.onclick = () => listarUsuarios(paginaAtual + 1);
}

listarUsuarios();

function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function deletarUsuario(idUsuario) {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    fetch(`/api/usuarios/usuario/${idUsuario}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(resposta => {
            if (resposta.success) {
                alert("Usuário deletado com sucesso!");
                listarUsuarios(); // Atualiza a tabela
            } else {
                alert("Erro ao deletar: " + resposta.message);
            }
        })
        .catch(erro => {
            console.error("Erro ao deletar usuário:", erro);
            alert("Erro interno ao deletar.");
        });
}

function efetuarEdicaoUser() {
    const idUsuario = usuarioEditandoId; // você precisa armazenar esse ID ao abrir o modal
    const nome = document.getElementById("editarNomeUsuario").value;
    const email = document.getElementById("editarEmailUsuario").value;
    const cargo = document.getElementById("editarCargoUsuario").value;

    const status = document.getElementById("editarStatusUsuario").value === "user-ativo" ? "ativo" : "inativo";

    fetch(`/api/usuarios/usuario/${idUsuario}`, {
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

function editarUsuario(idUsuario) {
    usuarioEditandoId = idUsuario;

    // Busca os dados do usuário pelo ID
    fetch(`/api/usuarios/usuario/${idUsuario}`)
        .then(res => res.json())
        .then(usuario => {
            // Preenche os campos do modal
            document.getElementById("editarNomeUsuario").value = usuario.nome;
            document.getElementById("editarEmailUsuario").value = usuario.email;
            document.getElementById("editarCargoUsuario").value = usuario.fkCargo;
            document.getElementById("editarStatusUsuario").value = usuario.status === "ativo" ? "user-ativo" : "user-inativo";


            // Abre o modal
            telaOverlay.style.display = 'block';
            modalEditarUsuario.style.display = 'flex';
        })
        .catch(erro => {
            console.error("Erro ao buscar dados do usuário:", erro);
            alert("Não foi possível carregar os dados do usuário.");
        });
}

document.getElementById("filtroUnico").addEventListener("change", () => {
    const valor = document.getElementById("filtroUnico").value;

    let cargo = "";
    let status = "";

    if (valor.startsWith("cargo:")) {
        cargo = valor.split(":")[1];
    } else if (valor.startsWith("status:")) {
        status = valor.split(":")[1];
    }

    listarUsuarios(1, termoBuscaAtual, cargo, status);
});

const dropdowns = document.querySelectorAll('.dropdown-container');

dropdowns.forEach(drop => {
    const btn = drop.querySelector('.dropbtn');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        drop.classList.toggle('active');
    });
});

window.addEventListener('click', () => {
    dropdowns.forEach(drop => drop.classList.remove('active'));
});

