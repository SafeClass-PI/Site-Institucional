function entrar() {
    var emailVar = ipt_email.value;
    var senhaVar = ipt_senha.value;

    if (emailVar == "" || senhaVar == "") {
        mensagem_erro.innerHTML = "(Mensagem de erro para todos os campos em branco)";
        return false;
    }

    console.log("FORM LOGIN: ", emailVar);
    console.log("FORM SENHA: ", senhaVar);

    fetch("/api/usuarios/autenticar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            emailServer: emailVar,
            senhaServer: senhaVar
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Login realizado com sucesso!");
            sessionStorage.EMAIL_USUARIO = data.usuario.email;
            sessionStorage.SENHA_USUARIO = data.usuario.senha;
            window.location.href = "Dashboard/dashboard_geral.html";
        } else {
            alert(data.mensagem);
        }
    })
    .catch(erro => {
        console.log("Erro no fetch:", erro);
        alert("Houve um erro ao tentar realizar o login!");
    });

    return false;
}


document.getElementById('toggleSenha').addEventListener('click', function (e) {
    const senhaInput = document.getElementById('ipt_senha');

    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        this.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        senhaInput.type = 'password';
        this.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

document.getElementById('toggleConfirmarSenha').addEventListener('click', function (e) {
    const confirmarSenhaInput = document.getElementById('ipt_confirmar_senha');

    if (confirmarSenhaInput.type === 'password') {
        confirmarSenhaInput.type = 'text';
        this.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        confirmarSenhaInput.type = 'password';
        this.classList.replace('fa-eye-slash', 'fa-eye');
    }
});