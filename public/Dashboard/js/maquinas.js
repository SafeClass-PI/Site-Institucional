function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;
}

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


function adicionarUsuario() {
    telaOverlay.style.display = 'block'
    modalAdicionarMaquina.style.display = 'flex';
}

function cancelarAdicionarMaquina() {
    telaOverlay.style.display = 'none';
    modalAdicionarMaquina.style.display = 'none';
}

const editarStatusMaquina = document.getElementById('editarStatusMaquina');

function atualizarCorSelect() {
    const valor = editarStatusMaquina.value;

    if (valor === "user-ativo") {
        editarStatusMaquina.style.backgroundColor = " var(--cor-estavel)";
        editarStatusMaquina.style.color = "white";
    }
    else if (valor === "user-inativo") {
        editarStatusMaquina.style.backgroundColor = "var(--cor-critico)";
        editarStatusMaquina.style.color = "white";
    }
    else {
        editarStatusMaquina.style.backgroundColor = "";
        editarStatusMaquina.style.color = "";
    }
}

if (editarStatusMaquina) {
    editarStatusMaquina.addEventListener("change", atualizarCorSelect);
    atualizarCorSelect();
}

function editarMaquina() {
    telaOverlay.style.display = 'block';
    modalEditarMaquina.style.display = 'flex';
}

function cancelarEdicaoMaquina() {
    telaOverlay.style.display = 'none';
    modalEditarMaquina.style.display = 'none';
}

function efetuarEdicaoMaquina() {
    alert('Usuário editado com sucesso!');
    telaOverlay.style.display = 'none';
    modalEditarMaquina.style.display = 'none';
}

function deletarMaquina() {
    telaOverlay.style.display = 'block';
    modalDeletarMaquina.style.display = 'flex';
}

function cancelarExclusaoMaquina() {
    telaOverlay.style.display = 'none';
    modalDeletarMaquina.style.display = 'none';
}

function confirmarExclusaoMaquina() {
    alert('Máquina editada com sucesso!');
    telaOverlay.style.display = 'none';
    modalDeletarMaquina.style.display = 'none';
}

function abrirModalDesligarMaquinas() {
    telaOverlay.style.display = 'block';
    modalDesligarMaquinas.style.display = 'flex';
}

function cancelarDesligamento() {
    telaOverlay.style.display = 'none';
    modalDesligarMaquinas.style.display = 'none';
}

function efetuarDesligamento() {
    telaOverlay.style.display = 'none';
    modalDesligarMaquinas.style.display = 'none';
    alert('Máquina desligada!')

    var maquina = document.getElementById('maquina-1');
    var line = document.getElementById('line-1');

    maquina.style.color = '#ea0303';
    maquina.innerHTML = 'Desligada';
    line.style.backgroundColor = '#ea0303';
}