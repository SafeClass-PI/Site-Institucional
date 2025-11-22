let proximaAtualizacao = null;
let myChart = null;
let idComponente = 3;

let proximaAtualizacaoRede = null;
let myChartRede = null;
let idComponenteRede = 5;

let chartDisponibilidade = null;
let chartFalhas = null;

function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;

    carregarSalas();
}

function atualizarDashboard() {
    if (!idMaquinaSelecionada) return;

    kpiStatusMaquina(idMaquinaSelecionada);
    kpiUptimeMaquina(idMaquinaSelecionada);
    kpiTaxaMaisCritica(idMaquinaSelecionada);
    kpiQtdAlertasMaquina(idMaquinaSelecionada);
    listarUltimosAlertasMaquina(idMaquinaSelecionada);
    graficoDisponibilidade(idMaquinaSelecionada);
    graficoFalhasPorComponente(idMaquinaSelecionada);
}

setInterval(atualizarDashboard, 5000);


function carregarSalas() {
    fetch("/api/dashboard/listarSalasMaquina")
        .then(res => res.json())
        .then(salas => {
            console.log("SALAS RECEBIDAS DO BACKEND:", salas);

            const selectSala = document.getElementById("escolha-sala");
            selectSala.innerHTML = "<option value=''>Salas:</option>";

            salas.forEach(s => {
                selectSala.innerHTML += `
                    <option value="${s.identificacao}">Sala ${s.identificacao}</option>
                `;
            });

            selectSala.value = "1";

            carregarMaquinasDaSala(1);

            selectSala.onchange = () => {
                if (selectSala.value) {
                    carregarMaquinasDaSala(selectSala.value);
                }
            }
        })
        .catch(erro => console.error("Erro ao carregar salas:", erro));
}

function carregarMaquinasDaSala(idSala) {
    fetch(`/api/dashboard/listarMaquinas/${idSala}`)
        .then(res => res.json())
        .then(maquinas => {
            const select = document.getElementById("escolha-maquina");
            select.innerHTML = "<option value=''>Máquinas:</option>";

            maquinas.forEach(m => {
                select.innerHTML += `<option value="${m.maquina}">Máquina ${m.maquina}</option>`;
            });

            if (idSala == 1) {
                select.value = "1";
                idMaquinaSelecionada = 1;

                carregarComponentesDaMaquina(1);
                carregarOpcoesRede(1);
                kpiStatusMaquina(1);
                kpiUptimeMaquina(1);
                kpiTaxaMaisCritica(1);
                kpiQtdAlertasMaquina(1);
                obterDadosGraficoComponente(idComponente, 1);
                obterDadosGraficoRede(idComponenteRede, 1);
                graficoDisponibilidade(1);
                graficoFalhasPorComponente(1);
                listarUltimosAlertasMaquina(1);

                atualizarDashboard();
            }

            select.onchange = () => {
                if (select.value) {
                    idMaquinaSelecionada = select.value;

                    carregarComponentesDaMaquina(idMaquinaSelecionada);
                    carregarOpcoesRede(idMaquinaSelecionada);
                    kpiStatusMaquina(idMaquinaSelecionada);
                    kpiUptimeMaquina(idMaquinaSelecionada);
                    kpiTaxaMaisCritica(idMaquinaSelecionada);
                    kpiQtdAlertasMaquina(idMaquinaSelecionada);
                    obterDadosGraficoComponente(idComponente, idMaquinaSelecionada);
                    obterDadosGraficoRede(idComponenteRede, idMaquinaSelecionada);
                    graficoDisponibilidade(idMaquinaSelecionada);
                    graficoFalhasPorComponente(idMaquinaSelecionada);
                    listarUltimosAlertasMaquina(idMaquinaSelecionada);

                    atualizarDashboard();
                }
            };
        });
}

function carregarOpcoesRede(idMaquinaSelecionada) {
    let selectComponente = document.getElementById("componente-grafico-rede");

    selectComponente.innerHTML = "";

    fetch(`/api/dashboard/carregarComponentesRede/${idMaquinaSelecionada}`)
        .then(res => res.json())
        .then(componentes => {
            componentes.forEach(c => {
                let option = document.createElement("option");
                option.value = c.id;
                option.textContent = c.nome;
                selectComponente.appendChild(option);
            });

            trocarComponenteRede();
        })
        .catch(err => console.error(err));
}

function carregarComponentesDaMaquina(idMaquinaSelecionada) {
    let selectComponente = document.getElementById("componente-grafico");

    selectComponente.innerHTML = "";

    fetch(`/api/dashboard/carregarComponentes/${idMaquinaSelecionada}`)
        .then(res => res.json())
        .then(componentes => {
            componentes.forEach(c => {
                let option = document.createElement("option");
                option.value = c.id;
                option.textContent = c.nome;
                selectComponente.appendChild(option);
            });

            trocarComponente();
        })
        .catch(err => console.error(err));
}

function kpiStatusMaquina(idMaquinaSelecionada) {
    fetch(`/api/dashboard/kpiStatusMaquina/${idMaquinaSelecionada}`, { cache: 'no-store' }).then(function (response) {
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

function kpiUptimeMaquina(idMaquinaSelecionada) {
    fetch(`/api/dashboard/kpiUptimeMaquina/${idMaquinaSelecionada}`, { cache: 'no-store' }).then(function (response) {
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
                else {
                    icone.style.transform = "rotate(0deg)";
                    icone.style.color = '#00AB03';
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

function kpiTaxaMaisCritica(idMaquinaSelecionada) {
    fetch(`/api/dashboard/kpiTaxaMaisCritica/${idMaquinaSelecionada}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                vt_dados = resposta;

                if (!vt_dados || vt_dados.length === 0) {
                    kpiTaxaMaisCriticaMaquina.innerHTML = `Sem taxa crítica!`;
                    return;
                }

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

function kpiQtdAlertasMaquina(idMaquinaSelecionada) {
    fetch(`/api/dashboard/kpiQtdAlertasMaquina/${idMaquinaSelecionada}`, { cache: 'no-store' }).then(function (response) {
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

function listarUltimosAlertasMaquina(idMaquinaSelecionada) {
    fetch(`/api/dashboard/listarUltimosAlertasMaquina/${idMaquinaSelecionada}`, { cache: 'no-store' })
        .then(response => {
            if (response.ok) {
                response.json().then(resposta => {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    const container = document.getElementById('alertasMaquina');
                    container.innerHTML = '';

                    if (!resposta || resposta.length === 0) {
                        container.style.display = 'flex';
                        container.style.justifyContent = 'center';
                        container.style.alignItems = 'center';
                        container.style.textAlign = 'center';

                        container.innerHTML = `
                        <div class="card-alerta" style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            text-align: center;
                            font-weight: 500;
                        ">
                            <p>Sem alertas recentes!</p>
                        </div>
                    `;
                        return;
                    }

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
    obterDadosGraficoComponente(idComponente, idMaquinaSelecionada);
}

function trocarComponenteRede() {
    idComponenteRede = document.getElementById("componente-grafico-rede").value;
    obterDadosGraficoRede(idComponenteRede, idMaquinaSelecionada);
}

function obterParametrosDoComponentePorNome(nome) {
    const tabelas = {
        "CPU": { atencao: 70, critico: 85, maxY: 100, formato: '%' },
        "RAM": { atencao: 12, critico: 14.2, maxY: 16, formato: 'gb' },
        "Disco": { atencao: 351, critico: 421, maxY: 500, formato: 'gb' },
    };

    return tabelas[nome] || null;
}

function obterParametrosDoComponenteRede(nome) {
    const tabelas = {
        "Download": { atencao: 70, critico: 85, maxY: 100, formato: 'Mbps' },
        "Upload": { atencao: 12, critico: 14.2, maxY: 16, formato: 'Mbps' },
    };

    return tabelas[nome] || null;
}

function obterDadosGraficoComponente(idComponente, idMaquinaSelecionada) {
    if (proximaAtualizacao != undefined) {
        clearTimeout(proximaAtualizacao);
    }

    fetch(`/api/dashboard/monitoramentoComponente/${idComponente}/${idMaquinaSelecionada}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(resposta => {
            resposta.reverse();
            plotarGrafico(resposta);
        })
        .catch(err => console.error(err));
}

function plotarGrafico(resposta) {

    const nomeComponente = resposta.length > 0 ? resposta[0].componente : null;

    const parametros = obterParametrosDoComponentePorNome(nomeComponente);

    let labels = [];
    let dados = {
        labels: labels,
        datasets: [{
            label: nomeComponente,
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
                            yMin: parametros.atencao,
                            yMax: parametros.atencao,
                            borderColor: '#f3c200ff',
                            borderWidth: 1.8,
                            borderDash: [5],
                            label: {
                                display: true,
                                content: ['Atenção'],
                                backgroundColor: '#ffd21dff',
                                color: 'white',
                                font: { size: 8, family: 'Poppins' },
                                position: 'start'
                            }
                        },
                        yMaxLine: {
                            type: 'line',
                            yMin: parametros.critico,
                            yMax: parametros.critico,
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
                    ticks: {
                        stepSize: parametros.maxY / 10,
                        callback: function (value) {
                            return value + parametros.formato;
                        }
                    },
                    min: 0,
                    max: parametros.maxY,
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
        document.getElementById(`monitoramento-componente`),
        config
    );

    proximaAtualizacao = setTimeout(() => atualizarGrafico(dados, myChart), 2000);
}

function atualizarGrafico(dados, myChart) {

    fetch(`/api/dashboard/monitoramentoComponenteTempoReal/${idComponente}/${idMaquinaSelecionada}`, { cache: 'no-store' })
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


function obterDadosGraficoRede(idComponenteRede, idMaquinaSelecionada) {
    if (proximaAtualizacaoRede != undefined) {
        clearTimeout(proximaAtualizacaoRede);
    }

    fetch(`/api/dashboard/monitoramentoComponenteRede/${idComponenteRede}/${idMaquinaSelecionada}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(resposta => {
            resposta.reverse();
            plotarGraficoRede(resposta);
        })
        .catch(err => console.error(err));
}

function plotarGraficoRede(resposta) {

    const nomeComponente = resposta.length > 0 ? resposta[0].componente : null;
    const parametros = obterParametrosDoComponenteRede(nomeComponente);

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
                            yMin: parametros.atencao,
                            yMax: parametros.atencao,
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
                            yMin: parametros.critico,
                            yMax: parametros.critico,
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
                    ticks: {
                        stepSize: parametros.maxY / 10,
                        font: {
                            size: 11 
                        },
                        callback: function (value) {
                            return value + parametros.formato;
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1,
                        drawBorder: false
                    },
                    min: 0,
                    max: parametros.maxY
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

    fetch(`/api/dashboard/monitoramentoComponenteRedeTempoReal/${idComponenteRede}/${idMaquinaSelecionada}`, { cache: 'no-store' })
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

function graficoDisponibilidade(idMaquinaSelecionada) {
    fetch(`/api/dashboard/graficoDisponibilidade/${idMaquinaSelecionada}`, { cache: 'no-store' }).then(function (response) {
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
        labels: ['Capturas Estáveis', 'Alertas'],
        datasets: [{
            label: ['Quantidade'],
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

    if (chartDisponibilidade != null) {
        chartDisponibilidade.destroy();
    }

    chartDisponibilidade = new Chart(
        document.getElementById('disponibilidade-maquina'),
        config
    );
}

function graficoFalhasPorComponente(idMaquinaSelecionada) {
    fetch(`/api/dashboard/graficoFalhasPorComponente/${idMaquinaSelecionada}`, { cache: 'no-store' }).then(function (response) {
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
