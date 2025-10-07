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



  function cadastrar() {
      var elementoCargo = document.getElementById('ipt_cargo');
    // aguardar();

    //Recupere o valor da nova input pelo nome do id
    // Agora vá para o método fetch logo abaixo
    var nomeVar = ipt_nome.value;
    var emailVar = ipt_email.value;
    var cargo_tipo_Var = elementoCargo.value;
    var fkTipo_Var = 0;
    // var codigoVar = ipt_codigo.value;
    if (cargo_tipo_Var == "gestor" || cargo_tipo_Var == "analista" ){
      fkTipo_Var = 1;
    }
    else {
      fkTipo_Var = 2;
    }
    var senhaVar = ipt_senha.value;
    var confirmacaoSenhaVar = ipt_confirmar_senha.value;

      if (nomeVar.length < 3) {
        alert("O nome deve ter pelo menos 3 caracteres.");
        return;
    }

    if (emailVar == "" || !emailVar.includes("@") || !emailVar.includes(".")) {
        alert("Por favor, insira um email válido.");
        return;
    }

    if (senhaVar.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres.");
        return;
    }

    if (senhaVar !== confirmacaoSenhaVar) {
        alert("As senhas não coincidem.");
        return;
    }
    if (fkTipo_Var == ""){
      alert("Por favor insira um cargo");
      return;
    }
    
    // Verificando se há algum campo em branco
    if (
      nomeVar == "" ||
      emailVar == "" ||
      senhaVar == "" ||
      confirmacaoSenhaVar == "" ||
      fkTipo_Var == "" 
      // codigoVar == "" ||
      // cargoVar == ""
    ) {
      cardErro.style.display = "block";
      mensagem_erro.innerHTML =
        "(Mensagem de erro para todos os campos em branco)";

      // finalizarAguardar();
      return false;
    } else {
      console.log("Testando!!!!!");
    }

    // // Verificando se o código de ativação é de alguma empresa cadastrada
    // for (let i = 0; i < listaEmpresasCadastradas.length; i++) {
    //   if (listaEmpresasCadastradas[i].codigo_ativacao == codigoVar) {
    //     idEmpresaVincular = listaEmpresasCadastradas[i].id
    //     console.log("Código de ativação válido.");
    //     break;
    //   } else {
    //     cardErro.style.display = "block";
    //     mensagem_erro.innerHTML = "(Mensagem de erro para código inválido)";
        // finalizarAguardar();
    //   }
    // }

    // Enviando o valor da nova input
    fetch("/usuarios/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // crie um atributo que recebe o valor recuperado aqui
        // Agora vá para o arquivo routes/usuario.js
        nomeServer: nomeVar,
        emailServer: emailVar,
        senhaServer: senhaVar,
        tipo_cargoServer: fkTipo_Var,
        // cargoServer: cargoVar
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);
        alert("Redirecionando para tela de login")
            window.location.href = "/login.html"

       
      })
      
  }

  // // Listando empresas cadastradas 
  // function listar() {
  //   fetch("/empresas/listar", {
  //     method: "GET",
  //   })
  //     .then(function (resposta) {
  //       resposta.json().then((empresas) => {
  //         empresas.forEach((empresa) => {
  //           listaEmpresasCadastradas.push(empresa);

  //           console.log("listaEmpresasCadastradas")
  //           console.log(listaEmpresasCadastradas[0].codigo_ativacao)
  //         });
  //       });
  //     })
  //     .catch(function (resposta) {
  //       console.log(`#ERRO: ${resposta}`);
  //     });
  // }

  // function sumirMensagem() {
  //   cardErro.style.display = "none";
  // }
