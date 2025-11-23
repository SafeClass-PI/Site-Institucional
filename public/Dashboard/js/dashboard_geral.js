function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;

    qtdMaquinasLigadas();
    TaxaUptimeEscola();
    qtdAlertas();
    listarSalas();
    listarUltimosAlertas();
    maquinaMaisCritica();

    setInterval(() => {
        qtdMaquinasLigadas();
        TaxaUptimeEscola();
        qtdAlertas();
        listarSalas();
        listarUltimosAlertas();
        maquinaMaisCritica();
    }, 2000);
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

function TaxaUptimeEscola() {
    fetch(`/api/dashboard/taxaUptimeEscola`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);


                vt_dados = resposta;
                var icone = document.querySelector('#kpi-taxa-uptime .icone-kpi i');

                if (parseFloat(vt_dados[0].uptimePercentual) < 60) {
                    icone.style.transform = "rotate(180deg)";
                    icone.style.color = '#ea0303';
                }

                kpiTaxaUptimeEscola.innerHTML = `${vt_dados[0].uptimePercentual}`;
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function maquinaMaisCritica() {
    fetch(`/api/dashboard/maquinaMaisCritica`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);


                vt_dados = resposta;


                if (!vt_dados || vt_dados.length === 0) {
                    modal = document.getElementById('modal-maquina-critica');
                    kpiMaquinaMaisCritica.style.fontSize = '17px';
                    modal.style.display = 'none';
                    kpiMaquinaMaisCritica.innerHTML = `Sem criticidade!`;
                    return;
                }

                kpiMaquinaMaisCritica.innerHTML = `${vt_dados[0].maquina}`;
                modalNomeMaquinaMaisCritica.innerHTML = `${vt_dados[0].maquina}`;
                modalLocalizacaoMaquinaMaisCritica.innerHTML = `${vt_dados[0].localizacao}`;
                modalMacAddressMaquinaMaisCritica.innerHTML = `${vt_dados[0].macaddress}`;
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

async function listarSalas() {
    try {
        const resposta = await fetch("/api/dashboard/listarSalas", { cache: "no-store" });
        const salas = await resposta.json();

        const painel = document.getElementById("painel-salas");
        painel.innerHTML = "";

        salas.forEach(sala => {

            const classeParametro =
                sala.mediana === "Crítico"
                    ? "parametro-sala-critico"
                    : sala.mediana === "Atenção"
                        ? "parametro-sala-atencao"
                        : "parametro-sala-estavel";

            const idParametro =
                sala.mediana === "Crítico"
                    ? "mediana-critico"
                    : sala.mediana === "Atenção"
                        ? "mediana-atencao"
                        : "mediana-estavel";

            const card = document.createElement("div");
            card.classList.add("card-sala");

            card.innerHTML = `
                <div class="identificao-sala">
                    <div class="numero-sala">
                        <p>${sala.nome}</p>
                    </div>
                    <div class="parametro-sala">
                        <div class="${classeParametro}"></div>
                    </div>
                </div>

                <div class="mediana-sala">
                    <p>Mediana: <span id="${idParametro}">${sala.mediana}</span></p>
                </div>

                <div class="silver-line"></div>

                <div class="quantidade-maquinas-sala">
                    <p>Quantidade de Máquinas:</p>
                    <p>${sala.qtdMaquinas}</p>
                </div>
            `;

            card.addEventListener("click", () => {
                mostrarMaquinasDaSala(sala.idSala);
            });


            painel.appendChild(card);
        });
    } catch (erro) {
        console.error("Erro ao listar salas:", erro);
    }
}


const painelSalas = document.getElementById('painel-salas');
const painelMaquinas = document.getElementById('painel-maquinas');
const nomeEscola = document.getElementById('nome-escola');

async function mostrarMaquinasDaSala(idSala) {
    nomeEscola.innerHTML += `<p>/Sala ${idSala}</p>`;

    painelSalas.style.display = 'none';

    painelMaquinas.style.display = 'grid';


    nomeEscola.innerHTML += '<button id="voltarSalas"><i class="fa-solid fa-circle-arrow-left"></i></button>';

    document.getElementById('voltarSalas').addEventListener('click', () => {
        nomeEscola.innerHTML = '<p>Todas as Salas</p>';
        painelMaquinas.style.display = 'none';
        painelSalas.style.display = 'grid';
        voltarSalas.style.display = 'none'
    });

    painelMaquinas.innerHTML = "";

    try {
        const resposta = await fetch(`/api/dashboard/mostrarMaquinas?idSala=${idSala}`);
        const maquinas = await resposta.json();

        maquinas.forEach(maquina => {

            const classeParametro =
                maquina.status === "Crítico"
                    ? "parametro-critico"
                    : maquina.status === "Atenção"
                        ? "parametro-atencao"
                        : "parametro-estavel";

            const idStatus =
                maquina.status === "Crítico"
                    ? "status-critico"
                    : maquina.status === "Atenção"
                        ? "status-atencao"
                        : "status-estavel";

            const card = document.createElement("div");
            card.classList.add("card-maquina");

            card.innerHTML = `
                <div class="identificao-maquina">
                    <div class="numero-maquina">
                        <p>${maquina.identificacao}</p>
                    </div>
                    <div class="parametro-maquina">
                        <div class="icone-parametro-maquina" id="${classeParametro}"></div>
                    </div>
                </div>

                <div class="status-maquina">
                    <p>Status: <span id="${idStatus}">${maquina.status}</span></p>
                </div>

                <div class="silver-line"></div>

                <div class="info-maquina">
                    <p>${maquina.descricao}</p>
                </div>
            `;

            painelMaquinas.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao carregar máquinas:", erro);
    }
}

async function listarUltimosAlertas() {
    try {
        const resposta = await fetch("/api/dashboard/listarUltimosAlertas", { cache: "no-store" });
        const alertas = await resposta.json();

        const painel = document.getElementById("alertas");
        painel.innerHTML = "";

        if (!alertas || alertas.length === 0) {
            const card = document.createElement("div");
            card.classList.add("card-alerta", "sem-alertas");
            card.style.marginTop = '50%';
            card.innerHTML = `
                <p style="width:100%; text-align:center; margin-top: 25px; font-weight: 500;">Sem alertas recentes!</p>
            `;

            painel.appendChild(card);
            return;
        }

        alertas.forEach(alerta => {
            const card = document.createElement("div");
            card.classList.add("card-alerta");

            const nivel =
                alerta.nivel === "Crítico"
                    ? "fa-solid fa-circle-exclamation"
                    : alerta.nivel === "Atenção"
                        ? "fa-solid fa-triangle-exclamation"
                        : "";

            card.innerHTML = `
                <div class="icone-card-alerta">
                    <i class="${nivel}"></i>
                </div>
                <div class="infos-card-alerta">
                    <p>Máquina ${alerta.identificacao}</p>
                    <p>${alerta.comp} a ${alerta.registro}${alerta.formatacao}</p>
                    <p>Sala ${alerta.sala} - ${tempoRelativo(alerta.hora)}</p>
                </div>
            `;

            painel.appendChild(card);
        });
    } catch (erro) {
        console.error("Erro ao listar salas:", erro);
    }
}

function tempoRelativo(dataStr) {
    const agora = new Date();
    const captura = new Date(dataStr);
    const diffMs = agora - captura;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "Agora";
    if (diffMin < 60) return `há ${diffMin} min`;
    const diffHoras = Math.floor(diffMin / 60);
    if (diffHoras < 24) return `há ${diffHoras} h`;
    const diffDias = Math.floor(diffHoras / 24);
    return `há ${diffDias} d`;
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

/* ---------- IRRELEVANTE ------------------ */

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

const dropdowns = document.querySelectorAll('.dropdown-container');

dropdowns.forEach(drop => {
    const btn = drop.querySelector('.dropbtn');

    btn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        drop.classList.toggle('active');
    });
});

window.addEventListener('click', () => {
    dropdowns.forEach(drop => drop.classList.remove('active'));
});