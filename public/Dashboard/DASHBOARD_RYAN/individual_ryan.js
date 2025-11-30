function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;

    var imgPerfil = document.getElementById('imgPerfil');

    if (imgPerfil) {
        if (sessionStorage.IMAGEM_USUARIO && sessionStorage.IMAGEM_USUARIO.trim() !== "") {
            imgPerfil.src = `../../../uploads/${sessionStorage.IMAGEM_USUARIO}`;
        } else {
            imgPerfil.src = '../imgs/profile-default.webp';
        }
    }
    carregarSalas();
}


function carregarSalas() {
    fetch("/api/ryan/carregarSalas")
        .then(res => res.json())
        .then(salas => {
            const select = document.getElementById("escolha-sala");
            select.innerHTML = "<option value=''>Salas:</option>";

            salas.forEach(s => {
                select.innerHTML += `
                    <option value="${s.identificacao}">Sala ${s.identificacao}</option>
                `;
            });

            idSala = "1";
            select.value = "1";

            atualizarDashboard();

            select.onchange = () => {
                if (select.value) {
                    idSala = select.value;
                    atualizarDashboard();
                }
            };
        })
        .catch(erro => console.error("Erro ao carregar salas:", erro));
}

function atualizarDashboard() {
    if (!idSala) return;

    estadoDaRedeAtual(idSala);
    qtdMaquinasInstaveis(idSala);
    horaMelhorAcesso(idSala);
    graficoSemana(idSala);
    listarMaquinasEstados(idSala);
    obterDadosGraficoPing(idSala);
}

setInterval(atualizarDashboard, 30000);

// -------------------- KPIS ---------------------------------------

function estadoDaRedeAtual(idSala) {
    fetch(`/api/ryan/kpiStatusRede/${idSala}`, { cache: 'no-store' }).then(function (response) {
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
                    icone.className = 'fa-solid fa-circle-up';
                    icone.style.transform = 'rotate(0deg)';
                    icone.style.color = '#00AB03';
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


function qtdMaquinasInstaveis(idSala) {
    fetch(`/api/ryan/kpiQtdMaquinasInstaveis/${idSala}`, { cache: 'no-store' }).then(function (response) {
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

function horaMelhorAcesso(idSala) {
    fetch(`/api/ryan/kpiHoraMelhorAcesso/${idSala}`, { cache: 'no-store' }).then(function (response) {
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

function previsionar() {
    if (!idSala) {
        alert("Selecione uma sala primeiro.");
        return;
    }

    fetch(`/api/ryan/carregarDadosPrevisao/${idSala}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {

                    if (!resposta || resposta.length === 0) {
                        alert('Ainda não há dados suficientes do dia!');
                        return;
                    }

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    const horarioDigitado = document.querySelector("#kpi-qtd-alertas-hoje input").value;

                    if (!horarioDigitado.match(/^\d{2}:\d{2}:\d{2}$/)) {
                        alert("Digite no formato HH:MM:SS");
                        return;
                    }

                    const valorPrevisto = preverPing(horarioDigitado, resposta);
                    valorPrevisto = Math.max(valorPrevisto, 0);

                    let estado = "Estável";
                    if (valorPrevisto >= 350) {
                        estado = "Instável";
                    } else if (valorPrevisto >= 250) {
                        estado = "Lento";
                    }

                    mostrarAlertaPrevisao(valorPrevisto, estado, horarioDigitado);
                });
            } else {
                console.error('Erro ao carregar dados da API');
            }
        })
        .catch(function (error) {
            console.error(`Erro ao obter dados: ${error.message}`);
        });
}

function preverPing(horarioDigitado, dados) {
    const { a, b } = calcularRegressao(dados);

    const xNovo = horaParaSegundos(horarioDigitado);

    return a + b * xNovo;
}

function calcularRegressao(dados) {
    const n = dados.length;

    let somaX = 0, somaY = 0, somaXY = 0, somaX2 = 0;

    dados.forEach(d => {
        const x = horaParaSegundos(d.horaCaptura);
        const y = d.medianaPing;

        somaX += x;
        somaY += y;
        somaXY += x * y;
        somaX2 += x * x;
    });

    const b = (n * somaXY - somaX * somaY) / (n * somaX2 - somaX * somaX);
    const a = (somaY - b * somaX) / n;

    return { a, b };
}

function horaParaSegundos(hora) {
    const [h, m, s] = hora.split(":").map(Number);
    return h * 3600 + m * 60 + s;
}

function mostrarAlertaPrevisao(valorPing, estado, horarioDigitado) {
    const alerta = document.getElementById("alertaDePrevisao");
    const pingSpan = document.getElementById("pingPrevisao");
    const estadoP = document.getElementById("estadoPrevisao");
    const corpo = document.querySelector(".corpo-estado-previsao");
    const hora = document.getElementById("horaPrevisao");

    hora.textContent = horarioDigitado;
    pingSpan.textContent = valorPing.toFixed(2) + "ms";
    estadoP.textContent = estado;

    if (estado.toLowerCase() === "instável") {
        corpo.style.backgroundColor = "#ea0303";
    } else if (estado.toLowerCase() === "lento") {
        corpo.style.backgroundColor = "#f5a623";
    } else {
        corpo.style.backgroundColor = "#28a745";
    }

    alerta.classList.remove("hide");
    alerta.classList.add("show");
}

// ---------------------- GRÁFICOS ---------------------------------------

let proximaAtualizacao = null;
let myChart = null;

let chartSemana = null;

function obterDadosGraficoPing(idSala) {
    if (proximaAtualizacao != undefined) {
        clearTimeout(proximaAtualizacao);
    }

    fetch(`/api/ryan/obterDadosGraficoPing/${idSala}`, { cache: 'no-store' })
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
    fetch(`/api/ryan/obterDadosGraficoPingUltimo/${idSala}`, { cache: 'no-store' })
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

function graficoSemana(idSala) {
    fetch(`/api/ryan/graficoSemana/${idSala}`, { cache: 'no-store' }).then(function (response) {
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

        if (registro.diaSemana == "2") {
            registro.diaSemana = "Segunda"
        }
        else if (registro.diaSemana == "3") {
            registro.diaSemana = "Terça"
        }
        else if (registro.diaSemana == "4") {
            registro.diaSemana = "Quarta"
        }
        else if (registro.diaSemana == "5") {
            registro.diaSemana = "Quinta"
        }
        else if (registro.diaSemana == "6") {
            registro.diaSemana = "Sexta"
        }

        labels.push(registro.diaSemana);
        dadosValores.push(Number(registro.qtdAcima250)); // força número
    }

    const maxValor = Math.max(...dadosValores);
    const maxIndex = dadosValores.indexOf(maxValor);

    const valoresOrdenados = [...dadosValores].sort((a, b) => b - a);
    const segundoMaior = valoresOrdenados[1];
    const segundoIndex = dadosValores.indexOf(segundoMaior);

    let backgroundColors = dadosValores.map(() => 'rgba(255,165,0,0.25)');
    let borderColors = dadosValores.map(() => 'orange');


    if (maxIndex !== -1) {
        backgroundColors[maxIndex] = '#eb0000c9';
        borderColors[maxIndex] = '#ea0303';
    }

    const data3 = {
        labels: labels,
        datasets: [{
            label: 'Qtd de Instabilidade',
            data: dadosValores,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 3,
            borderRadius: 7
        }]
    };

    const config3 = {
        type: 'bar',
        data: data3,
        options: {
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
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    console.log(backgroundColors);

    if (chartSemana != null) {
        chartSemana.destroy();
    }

    chartSemana = new Chart(
        document.getElementById('monitoramento-semana'),
        config3
    );
}

async function listarMaquinasEstados(idSala) {
    try {
        const resposta = await fetch(`/api/ryan/listarMaquinasEstados/${idSala}`, { cache: "no-store" });
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


function fecharAlerta() {
    const alerta = document.getElementById("alertaDePrevisao");
    alerta.classList.remove("show");
    alerta.classList.add("hide");
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

function abrirDuvidaPrevisao() {
    divExplicarPrevisao.style.display = 'flex';
}

function removerCardExplicacao() {
    divExplicarPrevisao.style.display = 'none';
}

const spanPing = document.getElementById('explicacaoPing');
const card = document.querySelector('.cardExplicacaoPing');

spanPing.addEventListener('mouseenter', () => {
    const rect = spanPing.getBoundingClientRect();
    card.style.display = 'flex';
});

spanPing.addEventListener('mouseleave', () => {
    card.style.display = 'none';
});


const duvidaMetrica = document.getElementById('explicacaoMetricas');
const cardExplicacaoMetrica = document.getElementById('modalExplicacaoMetricas');

duvidaMetrica.addEventListener('mouseenter', () => {
    const rect = duvidaMetrica.getBoundingClientRect();
    cardExplicacaoMetrica.style.display = 'flex';
});

duvidaMetrica.addEventListener('mouseleave', () => {
    cardExplicacaoMetrica.style.display = 'none';
});