function editarImagem() {
    // Cria um input temporário
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    // Quando o usuário escolher uma imagem
    input.onchange = () => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Atualiza a imagem do perfil
                document.getElementById('previewFoto').src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    }
    input.click();
}