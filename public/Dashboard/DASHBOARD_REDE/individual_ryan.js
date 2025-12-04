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
    dropDownsSideBar();
    carregarSalas();
}


function carregarSalas() { // Carrega todas as salas da escola, usuário escolhe conforme escolha
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

            idSala = "1"; // Deixo um padrão quando o usuário acessa a página
            select.value = "1";

            atualizarDashboard();
            obterDadosGraficoPing(1);

            select.onchange = () => {
                if (select.value) {
                    idSala = select.value;
                    atualizarDashboard();
                    obterDadosGraficoPing(idSala);
                }
            };
        })
        .catch(erro => console.error("Erro ao carregar salas:", erro));
}

function atualizarDashboard() { // Função para atualizar as informações a cada 30 segundos 
    if (!idSala) return;

    estadoDaRedeAtual(idSala);
    qtdMaquinasInstaveis(idSala);
    horaMelhorAcesso(idSala);
    graficoSemana(idSala);
    listarMaquinasEstados(idSala);

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

                const valores = resposta.map(item => item.registro).sort((a, b) => a - b); // Cria um novo array com os registros ordenados de forma crescente
                const meio = Math.floor(valores.length / 2); // Cálculo o indice central do array, arredondando para baixo (5,2 -> 5) 
                let mediana;

                if (valores.length % 2 === 1) { // Se a mediana é impar iremos achar o valor do meio
                    mediana = valores[meio];
                } else { // Se é par irá ser calculado a média dos dois valores centrais
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

                if (!resposta || resposta.length === 0) { // Caso não haja dados
                    kpiQtdMaquinasInstaveis.innerText = "Sem dado";
                }

                vt_dados = resposta;

                kpiQtdMaquinasInstaveis.innerText = `${resposta[0].maquinasInstaveis}/${resposta[0].totalMaquinas}`;

                var icone = document.querySelector('#iconeQtdMaquinasInstaveis i');

                // Muda o icone (i class) conforme o resultado, criticidade.
                if (resposta[0].maquinasInstaveis == 0) {
                    icone.className = 'fa-solid fa-circle-check';
                    icone.style.color = '#00AB03'
                }
                else {
                    icone.className = 'fa-solid fa-circle-exclamation';
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

                    let horarioDigitado = document.querySelector("#kpi-qtd-alertas-hoje input").value;

                    if (/^\d{2}:\d{2}$/.test(horarioDigitado)) { // Acrescento um default caso o usuário não digite os segundos                     
                        horarioDigitado += ":00";
                    }
                    else if (!/^\d{2}:\d{2}:\d{2}$/.test(horarioDigitado)) { // Verifico se o valor bate com o formato timestamp
                        alert("Digite no formato HH:MM ou HH:MM:SS");
                        return;
                    }

                    let valorPrevisto = preverPing(horarioDigitado, resposta); // Chamo a função criada para prever

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
    const { a, b } = calcularRegressao(dados); // Cálculo do intercepto e do coeficiente angular
    const xNovo = horaParaSegundos(horarioDigitado); // Transformo o horário digita em segundos
    const valorPrevisto = a + b * xNovo; // Equação da regressão 

    if (valorPrevisto < 0) { // Não traz valores negativo, pois já é estável.
        return 0;
    } else if (valorPrevisto > 450) { // Estabeleço um limite caso o cálculo entregue um valor muito alto
        return 450;
    } 
    else {
        return valorPrevisto;
    }
}

function horaParaSegundos(hora) {
    const [h, m, s] = hora.split(":").map(Number); // Divide a hora e converte para number
    return h * 3600 + m * 60 + s; // Multiplicamos com os devidos segundos
}

function calcularRegressao(dados) { // Fórmula da regressão
    const n = dados.length;

    let somaX = 0 
    let somaY = 0
    let somaXY = 0
    let somaX2 = 0;

    dados.forEach(d => {
        const x = horaParaSegundos(d.horaCaptura); // Retorno o timestamp do banco para segundos para facilitar o cálculo 
        const y = d.medianaPing; 
        somaX += x;
        somaY += y;
        somaXY += x * y;
        somaX2 += x * x;
    });

    const b = (n * somaXY - somaX * somaY) / (n * somaX2 - somaX * somaX);
    const a = (somaY - b * somaX) / n;

    return {a, b}; // Manda para a funcao preverPing()
}

function mostrarAlertaPrevisao(valorPing, estado, horarioDigitado) {
    const alerta = document.getElementById("alertaDePrevisao");
    const pingSpan = document.getElementById("pingPrevisao");
    const horario = document.getElementById("horarioPrevisao");
    const espacoMensagem = document.getElementById("mensagemPingPrevisao");
    const botao = document.querySelector(".titulo-alerta button");

    let mensagem = "";

    if (estado.toLowerCase() === "instável") { // Estilizo o alerta de previsão com base a resposta
        mensagem = "A conexão provavelmente estará ruim nesse horário.";
        alertaDePrevisao.style.backgroundColor = "#ea0303"
        espacoMensagem.style.color = "#ffffff";
        infoPingPrevisionado.style.color = "#ffffff";
        fecharAlertaPrevisao.style.color = "white";
        botao.style.backgroundColor = "red";
    }
    else if (estado.toLowerCase() === "lento") {
        mensagem = "A conexão pode apresentar instabilidade nesse horário.";
        alertaDePrevisao.style.backgroundColor = "#ffd630"
        espacoMensagem.style.color = "#1a1a1aff";
        infoPingPrevisionado.style.color = "#1a1a1aff";
        fecharAlertaPrevisao.style.color = "red";
        botao.style.backgroundColor = "white";
    }
    else {
        mensagem = "A conexão deve estar boa nesse horário.";
        alertaDePrevisao.style.backgroundColor = "#00AB03"
        espacoMensagem.style.color = "#ffffff";
        infoPingPrevisionado.style.color = "#ffffff";
        fecharAlertaPrevisao.style.color = "red";
        botao.style.backgroundColor = "white";
    }

    horario.textContent = horarioDigitado;
    pingSpan.textContent = valorPing.toFixed(2) + "ms";
    espacoMensagem.innerText = mensagem;

    // Ploto a animação que criei, usando as classes do css
    alerta.classList.remove("hide");
    alerta.classList.add("show");
}

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

function atualizarGrafico(dados, myChart) { // Função do Web Data Viz para atualizar o gráfico
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

        if (registro.diaSemana == "2") {  // Retorno o dia da semana conforme o número
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

        labels.push(registro.diaSemana); // Trago o "nome do dia" para o gráfico
        dadosValores.push(Number(registro.qtdAcima250)); // Trago a qtd em formato númérico no gráfico de barras
    }

    const maxValor = Math.max(...dadosValores); // Spread (espalha os valores) e retorna o maior valor do array
    const maxIndex = dadosValores.indexOf(maxValor); // Retorna o indice do maior valor capturado

    let backgroundColors = dadosValores.map(() => 'rgba(255,165,0,0.25)'); // Crio um array com
    //  o length de dadosValores, com a cor que será de background para as barras do gráfico.

    let borderColors = dadosValores.map(() => 'orange'); // O mesmo mas para a borda

    if (maxIndex !== -1) { // Se o maior valor existir...
        backgroundColors[maxIndex] = '#eb0000c9';
        borderColors[maxIndex] = '#ea0303';
    }

    const data3 = {
        labels: labels,
        datasets: [{
            label: 'Qtd de Instabilidade',
            data: dadosValores,
            backgroundColor: backgroundColors, // Atribuo as estilizações
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


    if (chartSemana != null) {
        chartSemana.destroy();
    }

    chartSemana = new Chart(
        document.getElementById('monitoramento-semana'),
        config3
    );
}

function listarMaquinasEstados(idSala) {
    fetch(`/api/ryan/listarMaquinasEstados/${idSala}`, { cache: "no-store" })
        .then(resposta => resposta.json())
        .then(maquinas => {
            const painel = document.getElementById("alertasMaquina");
            painel.innerHTML = "";
            console.log(maquinas);

            maquinas.forEach(m => {

                let estadoClass = null; // Retorno a estilização do icone "computer" para cada caso de estado

                if (m.estadoMaquina === "Instável") {
                    estadoClass = "status-instavel";
                } else if (m.estadoMaquina === "Lento") {
                    estadoClass = "status-lento";
                } else {
                    estadoClass = "status-estavel";
                }

                let estadoClass2 = null; // Retorno a estilização da div "estado" para cada caso de estado

                if (m.estadoMaquina === "Instável") {
                    estadoClass2 = "status-maquina-instavel";
                } else if (m.estadoMaquina === "Lento") {
                    estadoClass2 = "status-maquina-lento";
                } else {
                    estadoClass2 = "status-maquina-estavel";
                }

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
        })
        .catch(erro => console.error("Erro ao listar máquinas:", erro));
}

// ---------------------- CAPRICHOS DA PÁGINA ----------------------------------

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

function dropDownsSideBar() {
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
}

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

function abrirModalExplicacaoMetricas() {
    modalExplicacaoMetricas.style.display = 'flex';
}

function fecharModalMetricas() {
    modalExplicacaoMetricas.style.display = 'none';
}