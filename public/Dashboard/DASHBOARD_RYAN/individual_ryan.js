function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;

    var imgPerfil = document.getElementById('imgPerfil');

    if (imgPerfil) {
        if (sessionStorage.IMAGEM_USUARIO && sessionStorage.IMAGEM_USUARIO.trim() !== "") {
            imgPerfil.src = `/uploads/${sessionStorage.IMAGEM_USUARIO}`;
        } else {
            imgPerfil.src = 'imgs/profile-default.webp';
        }
    }

    carregarSalas();
    estadoDaRedeAtual();
    qtdMaquinasInstaveis();
    horaMelhorAcesso();
    graficoSemana();
    listarMaquinasEstados();
    obterDadosGraficoPing();
}

let proximaAtualizacao = null;
let myChart = null;

// -------------------- KPIS ---------------------------------------

function carregarSalas() {
    fetch("/api/ryan/carregarSalas")
        .then(res => res.json())
        .then(salas => {
            const selectSala = document.getElementById("escolha-sala");
            selectSala.innerHTML = "<option value=''>Salas:</option>";

            salas.forEach(s => {
                selectSala.innerHTML += `
                    <option value="${s.identificacao}">Sala ${s.identificacao}</option>
                `;
            });
        })
        .catch(erro => console.error("Erro ao carregar salas:", erro));
}

function estadoDaRedeAtual() {
    fetch(`/api/ryan/kpiStatusRede`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                var icone = document.querySelector('#iconeStatusMaquina i');

                if (!resposta || resposta.length === 0) {
                    kpiStatusRede.innerText = "Sem dado";
                    icone.style.color = '#ea0303';
                    icone.className = 'fa-solid fa-circle-xmark';

                    return;
                }

                const valores = resposta.map(item => item.registro).sort((a, b) => a - b);
                const meio = Math.floor(valores.length / 2);
                let mediana;

                if (valores.length % 2 === 1) {
                    mediana = valores[meio];
                } else {
                    mediana = (valores[meio - 1] + valores[meio]) / 2;
                }

                vt_dados = resposta;

                if (mediana < 250) {
                    kpiStatusRede.innerText = `Estável`
                }
                else if (mediana >= 250 && mediana < 350) {
                    kpiStatusRede.innerText = `Lenta`
                    icone.className = 'fa-solid fa-wind';
                    icone.style.color = '#ffd630';
                    icone.style.fontSize = '55px';
                }
                else if (mediana >= 350) {
                    kpiStatusRede.innerText = `Instável`
                    icone.style.transform = 'rotate(180deg)';
                    icone.style.color = '#ea0303';
                }
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}


function qtdMaquinasInstaveis() {
    fetch(`/api/ryan/kpiQtdMaquinasInstaveis`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                if (!resposta || resposta.length === 0) {
                    kpiQtdMaquinasInstaveis.innerText = "Sem dado";
                }

                vt_dados = resposta;

                kpiQtdMaquinasInstaveis.innerText = `${resposta[0].maquinasInstaveis}/${resposta[0].totalMaquinas}`;

                var icone = document.querySelector('#iconeQtdMaquinasInstaveis i');

                if (resposta[0].maquinasInstaveis == 0) {
                    icone.className = 'fa-solid fa-circle-check';
                    icone.style.color = '#00AB03'
                }

            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function horaMelhorAcesso() {
    fetch(`/api/ryan/kpiHoraMelhorAcesso`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                if (!resposta || resposta.length === 0) {
                    kpiHoraMelhorAcesso.innerText = "Sem dado";
                }

                vt_dados = resposta;

                kpiHoraMelhorAcesso.innerText = `${vt_dados[0].horaRecomendada}`;
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

// ---------------------- GRÁFICOS ---------------------------------------

function obterDadosGraficoPing() {
    if (proximaAtualizacao != undefined) {
        clearTimeout(proximaAtualizacao);
    }

    fetch(`/api/ryan/obterDadosGraficoPing`, { cache: 'no-store' })
        .then(response => response.json())
        .then(resposta => {
            resposta.reverse();
            plotarGraficoMonitoramentoPing(resposta);
        })
        .catch(err => console.error(err));
}

function plotarGraficoMonitoramentoPing(resposta) {

    let labels = [];
    let dados = {
        labels: labels,
        datasets: [{
            label: 'Ping',
            data: [],
            borderColor: 'orange',
            backgroundColor: 'rgba(255,165,0,0.2)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'white',
            pointBorderColor: 'orange',
            pointHoverRadius: 7,
            pointRadius: 5
        }]
    };

    for (let i = 0; i < resposta.length; i++) {
        labels.push(resposta[i].horaCaptura);
        dados.datasets[0].data.push(resposta[i].medianaPing);
    }

    const config = {
        type: 'line',
        data: dados,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 166, 0, 0.93)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + context.raw;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        yMinLine: {
                            type: 'line',
                            yMin: 250,
                            yMax: 250,
                            borderColor: '#f3c200ff',
                            borderWidth: 1.8,
                            borderDash: [5],
                            label: {
                                display: true,
                                content: ['Lento'],
                                backgroundColor: '#ffd21dff',
                                color: 'white',
                                font: { size: 8, family: 'Poppins' },
                                position: 'start'
                            }
                        },
                        yMaxLine: {
                            type: 'line',
                            yMin: 350,
                            yMax: 350,
                            borderColor: '#ea0303',
                            borderWidth: 1.8,
                            borderDash: [5],
                            label: {
                                display: true,
                                content: ['Instável'],
                                backgroundColor: '#ea0303',
                                color: 'white',
                                font: { size: 8, family: 'Poppins' },
                                position: 'end'
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 400 / 10,
                        callback: function (value) {
                            return value + "ms";
                        }
                    },
                    min: 0,
                    max: 400,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1,
                        drawBorder: false
                    }
                },
                x: { grid: { display: false } }
            }
        }
    };

    if (myChart != null) myChart.destroy();

    myChart = new Chart(
        document.getElementById(`monitoramento-ping`),
        config
    );

    proximaAtualizacao = setTimeout(() => atualizarGrafico(dados, myChart), 30000);
}

function atualizarGrafico(dados, myChart) {
    if (proximaAtualizacao) clearTimeout(proximaAtualizacao);
    fetch(`/api/ryan/obterDadosGraficoPingUltimo`, { cache: 'no-store' })
        .then(response => response.json())
        .then(novoRegistro => {

            if (novoRegistro[0].horaCaptura == dados.labels[dados.labels.length - 1]) {

                console.log("Sem novos dados.");

            } else {

                dados.labels.shift();
                dados.labels.push(novoRegistro[0].horaCaptura);

                dados.datasets[0].data.shift();
                dados.datasets[0].data.push(novoRegistro[0].medianaPing);

                myChart.update();
            }

            proximaAtualizacao = setTimeout(() => atualizarGrafico(dados, myChart), 30000);

        }).catch(err => console.error(err));
}

function atualizarPingSala() {
    fetch(`/api/ryan/pingMedianoSala`)
        .then(response => response.json())
        .then(resultado => {
            const mediana = resultado.mediana;

            if (mediana == null) return;

            const agora = new Date();
            const horario = agora.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

            adicionarPontoNoGrafico(horario, mediana);
        })
        .catch(erro => console.error("Erro:", erro));
}



function graficoSemana() {
    fetch(`/api/dashboard/graficoFalhasPorComponente}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                plotarGraficoSemana(resposta);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarGraficoSemana(resposta) {
    let labels = [];
    let dadosValores = [];

    for (let i = 0; i < resposta.length; i++) {
        let registro = resposta[i];

        if (registro.componente == "Disco Rígido") {
            registro.componente = "Disco"
        }
        else if (registro.componente == "Memória RAM") {
            registro.componente = "RAM"
        }

        labels.push(registro.componente);
        dadosValores.push(registro.quantidade);
    }

    const data3 = {
        labels: labels,
        datasets: [{
            label: 'Incidência de Falhas',
            data: dadosValores,
            backgroundColor: [
                'rgba(255, 99, 133, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };

    const config3 = {
        type: 'bar',
        data: data3,
        options: {
            indexAxis: 'y',

            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    display: false,
                },
                title: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    };

    if (chartFalhas != null) {
        chartFalhas.destroy();
    }

    chartFalhas = new Chart(
        document.getElementById('falhas-por-componente'),
        config3
    );
}

async function listarMaquinasEstados() {
    try {
        const resposta = await fetch(`/api/ryan/listarMaquinasEstados`, { cache: "no-store" });
        const maquinas = await resposta.json();

        const painel = document.getElementById("alertasMaquina");
        painel.innerHTML = "";

        maquinas.forEach(m => {

            const estadoClass =
                m.estadoMaquina === "Instável" ? "status-instavel" :
                    m.estadoMaquina === "Lento" ? "status-lento" :
                        "status-estavel";

            const estadoClass2 =
                m.estadoMaquina === "Instável" ? "status-maquina-instavel" :
                    m.estadoMaquina === "Lento" ? "status-maquina-lento" :
                        "status-maquina-estavel";

            const card = document.createElement("div");
            card.classList.add("maquina-sala");

            card.innerHTML = `
                <div class="icone-maquina-sala">
                    <div class="corpo-icone ${estadoClass}">
                        <i class="fa-solid fa-laptop"></i>
                    </div>
                </div>

                <div class="infos-maquina-sala">
                    <div class="id-ping-maquina">
                        <p>${m.identificacao}</p>
                        <p>${m.dadoPing}</p>
                    </div>

                    <div class="estado-maquina-sala">
                        <div class="${estadoClass2}">
                            <p>${m.estadoMaquina}</p>
                        </div>
                    </div>
                </div>
            `;

            painel.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao listar máquinas:", erro);
    }
}

// ---------------------- IRRELEVANTES ----------------------------------

function sairDaPagina() {
    modalLogout.style.display = 'flex';
    telaOverlay.style.display = 'block';
}

function cancelarSairDaPagina() {
    modalLogout.style.display = 'none';
    telaOverlay.style.display = 'none';
}

function confirmarSairDaPagina() {
    window.location.href = '../../index.html'
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