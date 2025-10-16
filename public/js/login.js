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
            console.log("🔍 Dados recebidos do backend:", data.usuario);

            if (data.success) {
                alert("Login realizado com sucesso!");
                sessionStorage.ID_USUARIO = data.usuario.idUsuario;
                sessionStorage.NOME_USUARIO = data.usuario.nome;
                sessionStorage.EMAIL_USUARIO = data.usuario.email;
                sessionStorage.CARGO_USUARIO = data.usuario.cargo;
                sessionStorage.STATUS_USUARIO = data.usuario.status;
                sessionStorage.DATA_ENTRADA = data.usuario.dtCadastro;

                console.log(sessionStorage.NOME_USUARIO);
                console.log(sessionStorage.CARGO_USUARIO);
                console.log(sessionStorage.DATA_ENTRADA);


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