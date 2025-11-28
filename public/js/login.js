// ======= FUNÇÃO DE LOGIN =======
async function entrar() {
    // pegar elementos do HTML
    const ipt_email = document.getElementById("ipt_email");
    const ipt_senha = document.getElementById("ipt_senha");

    const emailVar = ipt_email.value.trim();
    const senhaVar = ipt_senha.value.trim();

    // validação dos campos usando alert
    if (!emailVar || !senhaVar) {
        alert("Por favor, preencha todos os campos!");
        return false;
    }

    try {
        // faz login
        const resLogin = await fetch("/api/usuarios/autenticar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailServer: emailVar, senhaServer: senhaVar })
        });

        const dataLogin = await resLogin.json();
        console.log("🔍 Dados recebidos do backend:", dataLogin.usuario);

        if (!dataLogin.success) {
            alert(dataLogin.mensagem);
            return false;
        }

        alert("Login realizado com sucesso!");

        // salva dados no sessionStorage
        sessionStorage.ID_USUARIO = dataLogin.usuario.idUsuario;
        sessionStorage.NOME_USUARIO = dataLogin.usuario.nome;
        sessionStorage.EMAIL_USUARIO = dataLogin.usuario.email;
        sessionStorage.CARGO_USUARIO = dataLogin.usuario.cargo;
        sessionStorage.STATUS_USUARIO = dataLogin.usuario.status;
        sessionStorage.DATA_ENTRADA = dataLogin.usuario.dtCadastro;

        // marca usuário online
        await marcarUsuarioOnline(sessionStorage.ID_USUARIO);

        // redireciona
        window.location.href = "Dashboard/dashboard_geral.html";

    } catch (erro) {
        console.error("Erro no login ou marcar online:", erro);
        alert("Houve um erro ao tentar realizar o login!");
    }

    return false;
}

// Expõe a função no escopo global para o onclick funcionar
window.entrar = entrar;

// ======= FUNÇÃO PARA MARCAR USUÁRIO ONLINE =======
async function marcarUsuarioOnline(idUsuario) {
    try {
        const res = await fetch("/api/bia/usuario/online", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario })
        });

        const data = await res.json();
        console.log("✅ Usuário marcado como online:", data);
        return data;
    } catch (erro) {
        console.error("❌ Erro ao marcar usuário online:", erro);
        return null;
    }
}

// ======= TOGGLE SENHA =======
document.getElementById('toggleSenha').addEventListener('click', function () {
    const senhaInput = document.getElementById('ipt_senha');
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        this.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        senhaInput.type = 'password';
        this.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

document.getElementById('toggleConfirmarSenha')?.addEventListener('click', function () {
    const confirmarSenhaInput = document.getElementById('ipt_confirmar_senha');
    if (confirmarSenhaInput.type === 'password') {
        confirmarSenhaInput.type = 'text';
        this.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        confirmarSenhaInput.type = 'password';
        this.classList.replace('fa-eye-slash', 'fa-eye');
    }
});
