let proximaAtualizacao = null;
let myChart = null;
let idComponente = 3;

let proximaAtualizacaoRede = null;
let myChartRede = null;
let idComponenteRede = 5;

function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;

    kpiStatusMaquina();
    kpiUptimeMaquina();
    kpiTaxaMaisCritica();
    kpiQtdAlertasMaquina();
    obterDadosGraficoComponente(idComponente);
    obterDadosGraficoRede(idComponenteRede);
    graficoDisponibilidade();
    graficoFalhasPorComponente();
    listarUltimosAlertasMaquina();
}

function kpiStatusMaquina() {
    fetch(`/api/dashboard/kpiStatusMaquina`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);


                vt_dados = resposta;
                statusMaquina = vt_dados[0].estado_maquina;
                kpiStatusMaquinaEscola.innerHTML = `${statusMaquina}`;

                var icone = document.querySelector('#desempenho-maquina .icone-kpi i');

                if (statusMaquina == "Crítico") {
                    iconeStatusMaquina.style.backgroundColor = "white";

                    icone.className = "fa-solid fa-circle-exclamation";
                    icone.style.color = "#ea0303";
                    icone.style.fontSize = '60px';
                }
                else if (statusMaquina == "Atenção") {
                    iconeStatusMaquina.style.backgroundColor = "#ffd630";
                    icone.className = "fa-solid fa-triangle-exclamation";
                    icone.style.color = "white";
                    icone.style.fontSize = '30px';
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

function kpiUptimeMaquina() {
    fetch(`/api/dashboard/kpiUptimeMaquina`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);


                vt_dados = resposta;
                kpiUptimeMaquinaSala.innerHTML = `${vt_dados[0].uptime}%`;

                var icone = document.querySelector('#kpi-taxa-uptime .icone-kpi i');

                if (vt_dados[0].uptime < 60) {
                    icone.style.transform = "rotate(180deg)";
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

function kpiTaxaMaisCritica() {
    fetch(`/api/dashboard/kpiTaxaMaisCritica`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                vt_dados = resposta;
                kpiTaxaMaisCriticaMaquina.innerHTML = `${vt_dados[0].componente} a ${vt_dados[0].registro}${vt_dados[0].formatacao} - ${vt_dados[0].hora}`;
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function kpiQtdAlertasMaquina() {
    fetch(`/api/dashboard/kpiQtdAlertasMaquina`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                vt_dados = resposta;
                kpiQtdAlertasMaquinaSala.innerHTML = `${vt_dados[0].qtdAlerta}`;
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function listarUltimosAlertasMaquina() {
    fetch(`/api/dashboard/listarUltimosAlertasMaquina`, { cache: 'no-store' })
        .then(response => {
            if (response.ok) {
                response.json().then(resposta => {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    const container = document.getElementById('alertasMaquina');
                    container.innerHTML = '';

                    resposta.forEach(alerta => {
                        const card = document.createElement('div');
                        card.classList.add('card-alerta');

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
                                <p>Sala ${alerta.sala} -  ${tempoRelativo(alerta.hora)}</p>
                            </div>
                        `;

                        container.appendChild(card);
                    });
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(error => {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
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

function graficoDisponibilidade() {
    fetch(`/api/dashboard/graficoDisponibilidade`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                plotarGraficoDisponibilidade(resposta);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarGraficoDisponibilidade(resposta) {

    console.log('iniciando plotagem do gráfico...');

    let labels = [];

    let dados = {
        labels: labels,
        datasets: [{
            label: 'Time Admitted',
            data: [],
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

    console.log('----------------------------------------------')
    console.log('Estes dados foram recebidos pela funcao "obterDadosGrafico" e passados para "plotarGrafico":')
    console.log(resposta)

    for (let i = 0; i < resposta.length; i++) {
        let registro = resposta[i];
        labels.push("Uptime", "Downtime");
        dados.datasets[0].data.push(registro.capturasEstaveis);
        dados.datasets[0].data.push(registro.totalAlertas);
    }

    console.log('----------------------------------------------')
    console.log('O gráfico será plotado com os respectivos valores:')
    console.log('Labels:')
    console.log(labels)
    console.log('Dados:')
    console.log(dados.datasets)
    console.log('----------------------------------------------')

    const config = {
        type: 'pie',
        data: dados,
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

    new Chart(document.getElementById('disponibilidade-maquina'), config);
}

function graficoFalhasPorComponente() {
    fetch(`/api/dashboard/graficoFalhasPorComponente`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                plotarGraficoFalhasPorComponente(resposta);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarGraficoFalhasPorComponente(resposta) {
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
            label: 'Incidência de Falhas no Mês',
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

    new Chart(document.getElementById('falhas-por-componente'), config3);
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
