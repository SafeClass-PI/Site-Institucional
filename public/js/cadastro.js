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

    var nomeVar = ipt_nome.value;
    var emailVar = ipt_email.value;
    var cargo_tipo_Var = elementoCargo.value;
    var fkTipo_Var = 0;
    if (cargo_tipo_Var == "professor" || cargo_tipo_Var == "analista" ){
      fkTipo_Var = 2;
    }
    else {
      fkTipo_Var = 1;
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
    
    if (
      nomeVar == "" ||
      emailVar == "" ||
      senhaVar == "" ||
      confirmacaoSenhaVar == "" ||
      fkTipo_Var == "" 
    ) {
      cardErro.style.display = "block";
      mensagem_erro.innerHTML =
        "(Mensagem de erro para todos os campos em branco)";


      return false;
    } else {
      console.log("Testando!!!!!");
    }

    fetch("/usuarios/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nomeServer: nomeVar,
        emailServer: emailVar,
        senhaServer: senhaVar,
        tipo_cargoServer: fkTipo_Var,
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);
        alert("Redirecionando para tela de login")
            window.location.href = "/login.html"

       
      })
      
  }
