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

function abrirSolicitacoes() {
   modalSolicitacoes.style.display = 'block';
   telaOverlay.style.display = 'block'
}

function fecharSolicitacoes() {
   modalSolicitacoes.style.display = 'none';
   telaOverlay.style.display = 'none';
}