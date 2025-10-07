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

    // document.getElementById('toggleConfirmarSenha').addEventListener('click', function (e) {
    //     const confirmarSenhaInput = document.getElementById('ipt_confirmar_senha');
        
    //     if (confirmarSenhaInput.type === 'password') {
    //         confirmarSenhaInput.type = 'text';
    //         this.classList.replace('fa-eye', 'fa-eye-slash');
    //     } else {
    //         confirmarSenhaInput.type = 'password';
    //         this.classList.replace('fa-eye-slash', 'fa-eye');
    //     }
    // });

       function entrar() {
        // aguardar();

        var emailVar = ipt_email.value;
        var senhaVar = ipt_senha.value;
        

        if (emailVar == "" || senhaVar == "") {
            // cardErro.style.display = "block"
            mensagem_erro.innerHTML = "(Mensagem de erro para todos os campos em branco)";
            // finalizarAguardar();
            return false;
        }
        else {
            console.log("sumindo")
            // setInterval(sumirMensagem, 5000)
        }

        console.log("FORM LOGIN: ", emailVar);
        console.log("FORM SENHA: ", senhaVar);

        fetch("/usuarios/autenticar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: emailVar,
                senhaServer: senhaVar
            })
        }).then(function (resposta) {
            console.log("ESTOU NO THEN DO entrar()!")

            if (resposta.ok) {
                console.log(resposta);

                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json));
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.SENHA_USUARIO = json.senha
                    

                window.location.href = "dashboard.html";
                 });

            } else {

                console.log("Houve um erro ao tentar realizar o login!");

                resposta.text().then(texto => {
                    console.error(texto);
                    // finalizarAguardar(texto);
                });
            }

        }).catch(function (erro) {
            console.log(erro);
        })
        console.log("Saindo da função")
        return false;
    }

    // function sumirMensagem() {
    //     cardErro.style.display = "none"
    // }

