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