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