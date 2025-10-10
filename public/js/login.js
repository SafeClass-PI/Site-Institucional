function entrar() {
    var emailVar = ipt_email.value;
    var senhaVar = ipt_senha.value;

    if (emailVar == "" || senhaVar == "") {
        mensagem_erro.innerHTML = "(Mensagem de erro para todos os campos em branco)";
        return false;
    }

    console.log("FORM LOGIN: ", emailVar);
    console.log("FORM SENHA: ", senhaVar);

    fetch("/usuarios/autenticar", {
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
            // Aqui mostra o erro que veio do backend
            alert(data.mensagem);
        }
    })
    .catch(erro => {
        console.log("Erro no fetch:", erro);
        alert("Houve um erro ao tentar realizar o login!");
    });

    return false;
}
