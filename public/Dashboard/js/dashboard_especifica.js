let proximaAtualizacao = null;
let myChart = null;
let idComponente = 3;

let proximaAtualizacaoRede = null;
let myChartRede = null;
let idComponenteRede = 5;

function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;

    obterDadosGraficoComponente(idComponente);
    obterDadosGraficoRede(idComponenteRede);
}

/* ------------------------- GRÁFICOS ------------------------------------ */

function trocarComponente() {
    idComponente = document.getElementById("componente-grafico").value;
    obterDadosGraficoComponente(idComponente);
}

function trocarComponenteRede() {
    idComponenteRede = document.getElementById("componente-grafico-rede").value;
    obterDadosGraficoRede(idComponenteRede);
}


function obterDadosGraficoComponente(idComponente) {
    if (proximaAtualizacao != undefined) {
        clearTimeout(proximaAtualizacao);
    }

    fetch(`/api/dashboard/monitoramentoComponente/${idComponente}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(resposta => {
            resposta.reverse();
            plotarGrafico(resposta);
        })
        .catch(err => console.error(err));
}

function plotarGrafico(resposta) {
    let labels = [];
    let dados = {
        labels: labels,
        datasets: [{
            label: 'CPU',
            data: [],
            borderColor: 'orange',
            backgroundColor: 'rgba(255,165,0,0.2)',
            fill: true,
            tension: 0.4, // suaviza as curvas
            pointBackgroundColor: 'white', // cor do ponto
            pointBorderColor: 'orange',
            pointHoverRadius: 7,
            pointRadius: 5
        }]
    };

    for (let i = 0; i < resposta.length; i++) {
        labels.push(resposta[i].horacaptura);
        dados.datasets[0].data.push(resposta[i].registro);
    }

    const config = {
        type: 'line',
        data: dados,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // esconde legenda
                },
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
                            yMin: 52.7,
                            yMax: 52.7,
                            borderColor: '#f3c200ff',
                            borderWidth: 1.8,
                            borderDash: [5],
                            label: {
                                display: true,
                                content: ['Atenção'],
                                backgroundColor: '#ffd21dff',
                                color: 'rgba(255, 255, 255, 1)',
                                font: { size: 8, family: 'Poppins' },
                                position: 'start'
                            }
                        },
                        yMaxLine: {
                            type: 'line',
                            yMin: 65.3,
                            yMax: 65.3,
                            borderColor: '#ea0303',
                            borderWidth: 1.8,
                            borderDash: [5],
                            label: {
                                display: true,
                                content: ['Crítico'],
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
                    ticks: { stepSize: 50 },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1,
                        drawBorder: false
                    },
                    min: 0,
                    max: 100
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };

    // destruir gráfico anterior antes de criar outro
    if (myChart != null) myChart.destroy();

    myChart = new Chart(
        document.getElementById(`monitoramento-componente`),
        config
    );

    proximaAtualizacao = setTimeout(() => atualizarGrafico(dados, myChart), 2000);
}

function atualizarGrafico(dados, myChart) {

    fetch(`/api/dashboard/monitoramentoComponenteTempoReal/${idComponente}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(novoRegistro => {

            if (novoRegistro[0].horacaptura == dados.labels[dados.labels.length - 1]) {

                console.log("Sem novos dados.");

            } else {

                dados.labels.shift();
                dados.labels.push(novoRegistro[0].horacaptura);

                dados.datasets[0].data.shift();
                dados.datasets[0].data.push(novoRegistro[0].registro);

                myChart.update();
            }

            proximaAtualizacao = setTimeout(() => atualizarGrafico(dados, myChart), 2000);

        }).catch(err => console.error(err));
}


function obterDadosGraficoRede(idComponenteRede) {
    if (proximaAtualizacaoRede != undefined) {
        clearTimeout(proximaAtualizacaoRede);
    }

    fetch(`/api/dashboard/monitoramentoComponenteRede/${idComponenteRede}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(resposta => {
            resposta.reverse();
            plotarGraficoRede(resposta);
        })
        .catch(err => console.error(err));
}

function plotarGraficoRede(resposta) {
    let labels = [];
    let dados = {
        labels: labels,
        datasets: [{
            label: 'Download',
            data: [],
            borderColor: 'orange',
            backgroundColor: 'rgba(255,165,0,0.2)',
            fill: true,
            tension: 0.4, // suaviza as curvas
            pointBackgroundColor: 'white', // cor do ponto
            pointBorderColor: 'orange',
            pointHoverRadius: 7,
            pointRadius: 5
        }]
    };

    for (let i = 0; i < resposta.length; i++) {
        labels.push(resposta[i].horacaptura);
        dados.datasets[0].data.push(resposta[i].registro);
    }

    const config = {
        type: 'line',
        data: dados,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // esconde legenda
                },
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
                            yMin: 52.7,
                            yMax: 52.7,
                            borderColor: '#f3c200ff',
                            borderWidth: 1.8,
                            borderDash: [5],
                            label: {
                                display: true,
                                content: ['Atenção'],
                                backgroundColor: '#ffd21dff',
                                color: 'rgba(255, 255, 255, 1)',
                                font: { size: 8, family: 'Poppins' },
                                position: 'start'
                            }
                        },
                        yMaxLine: {
                            type: 'line',
                            yMin: 65.3,
                            yMax: 65.3,
                            borderColor: '#ea0303',
                            borderWidth: 1.8,
                            borderDash: [5],
                            label: {
                                display: true,
                                content: ['Crítico'],
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
                    ticks: { stepSize: 50 },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1,
                        drawBorder: false
                    },
                    min: 0,
                    max: 100
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };

    // destruir gráfico anterior antes de criar outro
    if (myChartRede != null) myChartRede.destroy();

    myChartRede = new Chart(
        document.getElementById(`monitoramento-rede`),
        config
    );

    proximaAtualizacaoRede = setTimeout(() => atualizarGraficoRede(dados, myChartRede), 2000);
}

function atualizarGraficoRede(dados, myChartRede) {

    fetch(`/api/dashboard/monitoramentoComponenteRedeTempoReal/${idComponenteRede}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(novoRegistro => {

            if (novoRegistro[0].horacaptura == dados.labels[dados.labels.length - 1]) {

                console.log("Sem novos dados.");

            } else {

                dados.labels.shift();
                dados.labels.push(novoRegistro[0].horacaptura);

                dados.datasets[0].data.shift();
                dados.datasets[0].data.push(novoRegistro[0].registro);

                myChartRede.update();
            }

            proximaAtualizacaoRede = setTimeout(() => atualizarGraficoRede(dados, myChartRede), 2000);

        }).catch(err => console.error(err));
}


const ctx2 = document.getElementById('disponibilidade-maquina').getContext('2d');

const data2 = {
    labels: ['Uptime', 'Downtime'],
    datasets: [{
        label: 'Time Admitted',
        data: [86, 14],
        borderColor: 'orange',
        backgroundColor: ['#0eca117d', '#ea0303ae'],
        borderWidth: 2.2,
        borderColor: ['#00d000d4', '#ff0000d7'],
        fill: true,
        tension: 0.4, // suaviza as curvas
        pointBackgroundColor: 'white', // cor do ponto
        pointBorderColor: 'orange',
        pointHoverRadius: 7,
        pointRadius: 5
    }]
};

const config2 = {
    type: 'pie',
    data: data2,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'black',
                titleColor: 'white',
                bodyColor: 'white',
                callbacks: {
                    label: function (context) {
                        return context.dataset.label + ': ' + context.raw;
                    }
                }
            }
        },
        scales: {
        },
    }
};

new Chart(ctx2, config2);

const labels = ['CPU', 'Disco', 'RAM', 'Rede'];
const dados = [1, 1, 0, 0];

const data3 = {
    labels: labels,
    datasets: [{
        label: 'Incidência de Falhas no Mês',
        data: dados,
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
                display: false,
                text: 'Classificação das Máquinas Mais Problemáticas'
            }
        },
        scales: {
            x: {
                min: 0,
                max: 3,
                beginAtZero: true
            },
            y: {
            }
        }
    }
};

const meuGrafico = new Chart(
    document.getElementById('falhas-por-componente'),
    config3
);

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
