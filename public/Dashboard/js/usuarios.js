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

function abrirSolicitacoes() {
   modalSolicitacoes.style.display = 'block';
   telaOverlay.style.display = 'block';
}

function fecharSolicitacoes() {
   modalSolicitacoes.style.display = 'none';
   telaOverlay.style.display = 'none';
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

editarStatusUsuario.addEventListener("change", atualizarCorSelect);
atualizarCorSelect();

function cancelarEditarUser() {
   telaOverlay.style.display = 'none';
   modalEditarUsuario.style.display = 'none';
}

function efetuarEdicaoUser() {
   alert('Usuário editado com sucesso!');
   telaOverlay.style.display = 'none';
   modalEditarUsuario.style.display = 'none';
}