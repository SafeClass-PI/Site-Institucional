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

    estadoDaRedeAtual();
    qtdMaquinasInstaveis();
    graficoMonitoramentoPing();
    graficoSemana();
}

// -------------------- KPIS ---------------------------------------

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

function graficoMonitoramentoPing() {

    const ctx = document.getElementById('monitoramento-ping').getContext('2d');

    const data = {
        labels: ['14:00:00', '14:00:10', '14:00:20', '14:00:30', '14:00:40', '14:00:50', '14:00:60', '14:00:70'],
        datasets: [{
            data: [21, 25, 24, 23, 24, 34, 46, 95],
            label: 'Time Admitted',
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

    const config = {
        type: 'line',
        data: data,
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

    new Chart(ctx, config);

}


function graficoSemana() {
    const ctx = document.getElementById('monitoramento-semana').getContext('2d');
    const data = {
        labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
        datasets: [{
            data: [8, 25, 15, 30, 24],
            label: 'Time Admitted',
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

    const config = {
        type: 'bar',
        data: data,
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
                    max: 50
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    new Chart(ctx, config);

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