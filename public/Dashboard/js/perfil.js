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


function editarImagem() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById('previewFoto');
        if (preview) {
          preview.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);

      salvarImagem(file); // ✅ envia para o backend
    }
  };
  input.click();
}

function salvarImagem(file) {
  const formData = new FormData();
  formData.append('foto', file);

  fetch('/api/usuarios/uploadFoto', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      console.log('Imagem salva com sucesso:', data.caminhoImagem);
    })
    .catch(err => console.error('Erro ao salvar imagem:', err));
}

function alterarSenhaPerfil() {
  const senhaAtual = document.getElementById("senha_atual").value;
  const novaSenha = document.getElementById("nova_senha").value;
  const confirmarSenha = document.getElementById("confirmar_senha").value;
  const idUsuario = sessionStorage.ID_USUARIO;
  const msg = document.getElementById("mensagem-atualizacao");

  if (!senhaAtual || !novaSenha || !confirmarSenha) {
    msg.innerHTML = `<p style="color: red;">Preencha todos os campos.</p>`;
    return;
  }

  if (novaSenha !== confirmarSenha) {
    msg.innerHTML = `<p style="color: red;">As senhas não coincidem.</p>`;
    return;
  }

  fetch(`/api/usuarios/alterar-senha/${idUsuario}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senhaAtual, novaSenha })
  })
    .then(res => res.json())
    .then(resposta => {
      if (resposta.success) {
        msg.innerHTML = `<p style="color: green;">${resposta.message}</p>`;
        limparInputsAlterarSenha();

        // ✅ Libera acesso após alteração de senha
        const bloqueio = document.querySelector('#bloqueio-interacao');
        if (bloqueio) bloqueio.remove();
        sessionStorage.PRECISA_ALTERAR_SENHA = 'false';
      } else {
        msg.innerHTML = `<p style="color: red;">${resposta.message}</p>`;
      }
    })
    .catch(erro => {
      console.error("Erro ao alterar senha:", erro);
      msg.innerHTML = `<p style="color: red;">Erro ao enviar solicitação.</p>`;
    });
}

function limparInputsAlterarSenha() {
  document.getElementById("senha_atual").value = "";
  document.getElementById("nova_senha").value = "";
  document.getElementById("confirmar_senha").value = "";
}

function preencherDadosPerfil() {
  const campoNome = document.getElementById("campoNome");
  const campoCargo = document.getElementById("campoCargo");
  const campoEmail = document.getElementById("campoEmail");
  const campoDataEntrada = document.getElementById("campoDataEntrada");
  const campoStatus = document.getElementById("campoStatus");

  if (campoNome) campoNome.innerText = sessionStorage.NOME_USUARIO;
  if (campoCargo) campoCargo.innerText = sessionStorage.CARGO_USUARIO;
  if (campoEmail) campoEmail.innerText = sessionStorage.EMAIL_USUARIO;

  if (campoDataEntrada) {
    const dataEntrada = new Date(sessionStorage.DATA_ENTRADA);
    campoDataEntrada.innerText = dataEntrada.toLocaleDateString('pt-BR');
  }

  if (campoStatus) campoStatus.innerText = sessionStorage.STATUS_USUARIO;
}

window.onload = function () {
  preencherDadosPerfil();
};

// ✅ Bloqueio de interação na tela de perfil
window.addEventListener('DOMContentLoaded', () => {
  const precisaAlterarSenha = sessionStorage.PRECISA_ALTERAR_SENHA === 'true';
  const estaNaTelaDePerfil = window.location.pathname.includes('perfil.html');

  if (precisaAlterarSenha && estaNaTelaDePerfil) {
    const bloqueio = document.createElement('div');
    bloqueio.id = 'bloqueio-interacao';
    bloqueio.style.position = 'fixed';
    bloqueio.style.top = '0';
    bloqueio.style.left = '0';
    bloqueio.style.width = '100vw';
    bloqueio.style.height = '100vh';
    bloqueio.style.zIndex = '9999';
    bloqueio.style.pointerEvents = 'all';
    bloqueio.style.backgroundColor = 'transparent';

    document.body.appendChild(bloqueio);

    const painelSenha = document.querySelector('.painel-alterar-senha');
    painelSenha.style.zIndex = '10000';
    painelSenha.style.pointerEvents = 'auto';
    painelSenha.style.position = 'relative';
  }
});
