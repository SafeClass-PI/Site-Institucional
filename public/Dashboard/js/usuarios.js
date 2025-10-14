// ======================================================================
// REFERÊNCIAS GLOBAIS (Certifique-se que estão definidas no seu escopo)
// ======================================================================
const telaOverlay = document.getElementById('telaOverlay');
const modalDeletarUsuario = document.getElementById('modalDeletarUsuario');
const modalSolicitacoes = document.getElementById('modalSolicitacoes');

// Referência ao <tbody> DENTRO do modal de solicitações
const tbodySolicitacoes = modalSolicitacoes ? modalSolicitacoes.querySelector('tbody') : null;


// ======================================================================
// FUNÇÕES EXISTENTES
// ======================================================================

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

// ======================================================================
// FUNÇÕES DE SOLICITAÇÃO (MODIFICADA E NOVAS)
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
        if (response.status === 200 || response.status === 404) {
            return response.json();
        }
        throw new Error(`Erro ${response.status} ao processar a solicitação.`);
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

// Adicione aqui outras funções como 'adicionarUsuario()' se necessário.