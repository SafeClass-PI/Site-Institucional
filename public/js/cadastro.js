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



 // NO SEU public/js/cadastro.js (APENAS A FUNÇÃO CADASTRAR)

// NO SEU public/js/cadastro.js

function cadastrar() {
    // 1. CAPTURA DOS VALORES (CORRIGIDO: usando document.getElementById)
    var elementoCargo = document.getElementById('ipt_cargo');

    var nomeVar = document.getElementById('ipt_nome').value; // Usando o ID do HTML
    var emailVar = document.getElementById('ipt_email').value; // Usando o ID do HTML
    var senhaVar = document.getElementById('ipt_senha').value; // Usando o ID do HTML
    var confirmacaoSenhaVar = document.getElementById('ipt_confirmar_senha').value; // Usando o ID do HTML
    
    // O código de ativação não está sendo usado no seu INSERT no Model, 
    // mas se for necessário, você deve capturá-lo aqui:
    // var codigoAtivacaoVar = document.getElementById('ipt_codigo').value;

    // 2. LÓGICA DE CONVERSÃO DE CARGO PARA FK
    var cargo_tipo_Var = elementoCargo.value;
    var fkTipo_Var = 0; // Valor padrão 0
    
    // A lógica de tipo (fkTipo) do seu Model
    if (cargo_tipo_Var == "professor" || cargo_tipo_Var == "analista" ){
      fkTipo_Var = 2; // Tipo 2 (Comum/Pendente)
    }
    else if (cargo_tipo_Var == "gestor") {
      fkTipo_Var = 1; // Tipo 1 (Administrador/Ativo)
    }
    // Note que fkTipo_Var deve ser 1 ou 2, dependendo do seu TipoUsuario

    // 3. VALIDAÇÕES (Mantidas e Ajustadas)
    
    if (nomeVar.length < 3) {
      alert("O nome deve ter pelo menos 3 caracteres.");
      return;
    }

    if (emailVar == "" || !emailVar.includes("@") || !emailVar.includes(".")) {
      alert("Por favor, insira um email válido.");
      return;
    }
    
    // Novo alerta, pois o campo cargo pode estar vazio se o usuário não selecionar
    if (fkTipo_Var == 0 || cargo_tipo_Var == "") {
      alert("Por favor, selecione um cargo.");
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

    // A validação final pode ser removida se as validações acima cobrirem todos os campos
    // (mantendo-a apenas como fallback)
    if (nomeVar == "" || emailVar == "" || senhaVar == "") { 
      // Não temos acesso a cardErro/mensagem_erro, então usamos alert
      alert("Preencha todos os campos obrigatórios."); 
      return;
    }


    // 4. FETCH PARA O BACKEND
    console.log("Enviando dados para a API...");

    fetch("/api/usuarios/cadastrar", { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // Nomes de variáveis que o Controller espera:
            nomeServer: nomeVar,
            emailServer: emailVar,
            senhaServer: senhaVar,
            tipo_cargoServer: fkTipo_Var, // Enviamos o ID numérico (1 ou 2)
        }),
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json();
        } else {
            // Captura erros HTTP (400, 500)
            resposta.json().then(error => {
                alert("Erro ao cadastrar: " + (error.mensagem || 'Erro desconhecido.'));
                throw new Error('Erro ao cadastrar. Status: ' + resposta.status);
            });
        }
    })
    .then(function (respostaJson) {
        if (respostaJson.success) {
            alert("Cadastro realizado com sucesso! Aguarde a liberação do gestor.");
            window.location.href = "/login.html";
        } else {
            alert("Falha no cadastro: " + (respostaJson.mensagem || "Verifique os dados.")); 
        }
    })
    .catch(function (erro) {
        console.error("Erro no fetch de cadastro:", erro);
        // Evita mostrar o erro interno de throw, usa o alert já exibido no then/catch
    });
}