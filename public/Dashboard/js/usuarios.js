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


// ======================================================================
// REFERÊNCIAS GLOBAIS (Certifique-se que estão definidas no seu escopo)
// ======================================================================
const telaOverlay = document.getElementById('telaOverlay');
const modalDeletarUsuario = document.getElementById('modalDeletarUsuario');
const modalSolicitacoes = document.getElementById('modalSolicitacoes');
const modalAdicionarUser = document.getElementById('modalAdicionarUser'); // Adicionado
const modalEditarUsuario = document.getElementById('modalEditarUsuario'); // Adicionado

// Referência ao <tbody> DENTRO do modal de solicitações
const tbodySolicitacoes = modalSolicitacoes ? modalSolicitacoes.querySelector('tbody') : null;


// ======================================================================
// FUNÇÕES EXISTENTES E DE GESTÃO BÁSICA
// ======================================================================

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
            alert(`Falha ao processar a solicitação: ${error.message}`);
        });
}