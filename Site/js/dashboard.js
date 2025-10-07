const kpis = [
    { titulo: "Uso médio de CPU", valor: "30%" },
    { titulo: "Uso médio de RAM", valor: "65%" },
    { titulo: "Uso médio de Disco", valor: "72%" }
];

let indice = 0;

// Elementos
const tituloKpi = document.getElementById("titulo-kpi");
const valorKpi = document.getElementById("valor-kpi");
const setaUso = document.getElementById("seta-uso");

function trocarKpi() {
    indice = (indice + 1) % kpis.length;
    tituloKpi.textContent = kpis[indice].titulo;
    valorKpi.textContent = kpis[indice].valor;
}

// Clique manual
setaUso.addEventListener("click", trocarKpi);

// Troca automática a cada 5 segundos (5000 ms)
setInterval(trocarKpi, 1800);

/* ------------------------- GRÁFICOS ------------------------------------ */

const ctx = document.getElementById('monitoramento-ao-longo-dia').getContext('2d');

const data = {
    labels: ['07 am', '08 am', '09 am', '10 am', '11 am', '12 pm', '11 am', '12 pm'],
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

new Chart(ctx, config);

const ctx1 = document.getElementById('falha-por-componente').getContext('2d');

const data1 = {
    labels: ['Memória Ram', 'Disco', 'CPU', 'Rede'],
    datasets: [{
        label: 'Time Admitted',
        data: [50, 115, 80, 95],
        borderWidth: 2,
        borderColor: 'orange',
        backgroundColor: '#ffcc005d',
        fill: true,
        tension: 0.4, // suaviza as curvas
        pointBackgroundColor: 'white', // cor do ponto
        pointBorderColor: 'orange',
        pointHoverRadius: 7,
        pointRadius: 5
    }]
};

const config1 = {
    type: 'bar',
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


const ctx2 = document.getElementById('disponibilidade-maquinas').getContext('2d');

const data2 = {
    labels: ['Inativo', 'Ativo'],
    datasets: [{
        label: 'Time Admitted',
        data: [50, 115],
        borderColor: 'orange',
        backgroundColor: ['#ffd9a0ff', '#fff76785 '],
        borderWidth: 2,
        borderColor: '#ac620047',
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

const labels = ['Máquina A', 'Máquina B', 'Máquina C', 'Máquina D', 'Máquina E'];
const dados = [150, 210, 80, 195, 30]; // Ex: Incidência de Falhas

const data3 = {
    labels: labels,
    datasets: [{
        label: 'Incidência de Falhas no Mês',
        data: dados,
        backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
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
                beginAtZero: true
            },
            y: {
            }
        }
    }
};

const meuGrafico = new Chart(
    document.getElementById('ranking-criticidade'),
    config3
);
