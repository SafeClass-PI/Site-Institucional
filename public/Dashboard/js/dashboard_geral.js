function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;

    qtdMaquinasLigadas();
    qtdAlertas();
}


/* --------------------- DADOS DA DASHBOARD ------------------------------------- */

function qtdMaquinasLigadas() {
    fetch(`/api/dashboard/qtdMaquinasLigadas`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);


                vt_dados = resposta;
                kpiQtdMaquinasLigadas.innerHTML = `${vt_dados[0].maquinasLigadas}/${vt_dados[0].totalMaquinas}`;
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function qtdAlertas() {
    fetch(`/api/dashboard/qtdAlertas`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);


                vt_dados = resposta;
                kpiQtdAlertas.innerHTML = `${vt_dados[0].qtdAlertas}`;
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}


function atualizarDataHora() {
    const agora = new Date();

    const data = agora.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });


    document.getElementById('dataHora').textContent = `${data}`;
}

atualizarDataHora();
setInterval(atualizarDataHora, 1000);


function sairDaPagina() {
    modalLogout.style.display = 'flex';
    telaOverlay.style.display = 'block';
}

function cancelarSairDaPagina() {
    modalLogout.style.display = 'none';
    telaOverlay.style.display = 'none';
}

function confirmarSairDaPagina() {
    window.location.href = '../index.html'
}


const painelSalas = document.getElementById('painel-salas');
const painelMaquinas = document.getElementById('painel-maquinas');
const nomeEscola = document.getElementById('nome-escola');

document.querySelectorAll('.card-sala').forEach(card => {
    card.addEventListener('click', () => {
        mostrarMaquinasDaSala();
    });
});

function mostrarMaquinasDaSala() {
    nomeEscola.innerHTML += '<p>/Sala 1</p>';

    painelSalas.style.display = 'none';

    painelMaquinas.style.display = 'grid';

    nomeEscola.innerHTML += '<button id="voltarSalas"><i class="fa-solid fa-circle-arrow-left"></i></button>';

    document.getElementById('voltarSalas').addEventListener('click', () => {
        nomeEscola.innerHTML = '<p>Todas as Salas</p>';
        painelMaquinas.style.display = 'none';
        painelSalas.style.display = 'grid';
        voltarSalas.style.display = 'none'
    });
}

const btnModal = document.getElementById('modal-maquina-critica');

btnModal.addEventListener('click', () => {
    telaOverlay.style.display = 'block';
    modalMaquina.style.display = 'flex';
});

function closeModal() {
    telaOverlay.style.display = 'none';
    modalMaquina.style.display = 'none';
}