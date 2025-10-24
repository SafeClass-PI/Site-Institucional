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
            }
            reader.readAsDataURL(file);

            salvarImagem(file);
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
    const idUsuario = sessionStorage.ID_USUARIO; // ou como você estiver armazenando

    const msg = document.getElementById("mensagem-atualizacao");

    // Validações básicas
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        msg.innerHTML = `<p style="color: red;">Preencha todos os campos.</p>`;
        return;
    }

    if (novaSenha !== confirmarSenha) {
        msg.innerHTML = `<p style="color: red;">As senhas não coincidem.</p>`;
        return;
    }

    // Requisição para o backend
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


