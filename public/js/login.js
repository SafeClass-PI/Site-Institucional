// ===== FUNÇÃO DE LOGIN =====
async function entrar() {
    const ipt_email = document.getElementById("ipt_email");
    const ipt_senha = document.getElementById("ipt_senha");

    const emailVar = ipt_email.value.trim();
    const senhaVar = ipt_senha.value.trim();

    // Validação
    if (!emailVar || !senhaVar) {
        alert("Por favor, preencha todos os campos!");
        return false;
    }

    try {
        // Autenticação
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

        // Salvar dados no sessionStorage
        sessionStorage.ID_USUARIO = dataLogin.usuario.idUsuario;
        sessionStorage.NOME_USUARIO = dataLogin.usuario.nome;
        sessionStorage.EMAIL_USUARIO = dataLogin.usuario.email;
        sessionStorage.CARGO_USUARIO = dataLogin.usuario.cargo;
        sessionStorage.STATUS_USUARIO = dataLogin.usuario.status;
        sessionStorage.DATA_ENTRADA = dataLogin.usuario.dtCadastro;

        // Marcar online
        await marcarUsuarioOnline(sessionStorage.ID_USUARIO);

        // Registrar login
        await fetch("/api/bia/registrarLogin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario: sessionStorage.ID_USUARIO })
        });

        // Redirecionar
        window.location.href = "Dashboard/dashboard_geral.html";

    } catch (erro) {
        console.error("Erro no login ou marcar online:", erro);
        alert("Houve um erro ao tentar realizar o login!");
    }

    return false;
}

// Tornar a função acessível ao onclick do botão
window.entrar = entrar;

// ===== MARCAR USUÁRIO ONLINE =====
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

// ===== TOGGLE SENHA =====
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
