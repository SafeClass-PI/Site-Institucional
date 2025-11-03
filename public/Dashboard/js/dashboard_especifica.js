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

const kpis = [
    { titulo: "Uso médio de CPU", valor: "30%" },
    { titulo: "Uso médio de RAM", valor: "65%" },
    { titulo: "Uso médio de Disco", valor: "72%" }
];

let indice = 0;

// Elementos
const tituloKpi = document.getElementById("titulo-kpi");
const valorKpi = document.getElementById("valor-kpi");

function trocarKpi() {
    indice = (indice + 1) % kpis.length;
    tituloKpi.textContent = kpis[indice].titulo;
    valorKpi.textContent = kpis[indice].valor;
}


// Troca automática a cada 5 segundos (5000 ms)
setInterval(trocarKpi, 1800);

/* ------------------------- GRÁFICOS ------------------------------------ */

const ctx = document.getElementById('monitoramento-componente').getContext('2d');

const data = {
    labels: ['14:00:00', '14:00:10', '14:00:20', '14:00:30', '14:00:40', '14:00:50', '14:00:60', '14:00:70'],
    datasets: [{
        label: 'Time Admitted',
        data: [50, 115, 80, 95, 120, 110, 50, 115],
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
                        yMin: 90,
                        yMax: 90,
                        borderColor: '#f3c200ff',
                        borderWidth: 1.8,
                        borderDash: [5],
                        label: {
                            display: true,
                            content: ['Atenção'],
                            backgroundColor: '#ffd21dff',
                            color: 'rgba(255, 255, 255, 1)',
                            font: { size: 9, family: 'Poppins' },
                            position: 'start'
                        }
                    },
                    yMaxLine: {
                        type: 'line',
                        yMin: 135,
                        yMax: 135,
                        borderColor: '#ea0303',
                        borderWidth: 1.8,
                        borderDash: [5],
                        label: {
                            display: true,
                            content: ['Crítico'],
                            backgroundColor: '#ea0303',
                            color: 'white',
                            font: { size: 9, family: 'Poppins' },
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
                }
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




const ctx1 = document.getElementById('monitoramento-rede').getContext('2d');

const data1 = {
    labels: ['100 Mbps', '150 Mbps', '200 Mbps', '250 Mbps'],
    datasets: [{
        label: 'Time Admitted',
        data: [50, 115, 80, 95],
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

const config1 = {
    type: 'line',
    data: data1,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // esconde legenda
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
            y: {
                beginAtZero: true,
                ticks: { stepSize: 50 },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)',
                    lineWidth: 1,
                    drawBorder: false
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
};

new Chart(ctx1, config1);


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
