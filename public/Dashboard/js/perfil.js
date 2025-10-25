function editarImagem() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('previewFoto').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
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

window.onload = function () {
  preencherDadosPerfil();
};

function preencherDadosPerfil() {
  document.getElementById("campoNome").innerText = sessionStorage.NOME_USUARIO;
  document.getElementById("campoCargo").innerText = sessionStorage.CARGO_USUARIO;
  document.getElementById("campoEmail").innerText = sessionStorage.EMAIL_USUARIO;

  const dataEntrada = new Date(sessionStorage.DATA_ENTRADA);
  const dataFormatada = dataEntrada.toLocaleDateString('pt-BR');
  document.getElementById("campoDataEntrada").innerText = dataFormatada;

  document.getElementById("campoStatus").innerText = sessionStorage.STATUS_USUARIO;
}

window.addEventListener('DOMContentLoaded', () => {
  const precisaAlterarSenha = sessionStorage.PRECISA_ALTERAR_SENHA === 'true';

  if (precisaAlterarSenha) {
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

