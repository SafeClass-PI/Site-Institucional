document.addEventListener("DOMContentLoaded", function () {
    criarGraficoAlertasCriticos();
    criarGraficoAlertasModerados();
    criarGraficoPizzaAlertas();   
});

const labelsMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

// Opções base – eixo Y fixo de 0 a 8
function criarOpcoesBase(tituloY) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Meses'
                }
            },
            y: {
                beginAtZero: true,
                min: 0,
                max: 8,
                ticks: {
                    stepSize: 1
                },
                title: {
                    display: true,
                    text: tituloY
                }
            }
        }
    };
}

// --------- GRÁFICO 1 – Alertas Críticos ---------
function criarGraficoAlertasCriticos() {
    const canvas = document.getElementById('monitoramento-componente');
    if (!canvas) return;

    canvas.style.width = '100%';
    canvas.height = 300;

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsMeses,
            datasets: [{
                label: 'Alertas Críticos',
                data: [2, 6, 3, 8, 4, 7], // mock por enquanto
                tension: 0.4,
                fill: false,
                borderWidth: 3,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: criarOpcoesBase('Qtd de Alertas Críticos')
    });
}

// --------- GRÁFICO 2 – Alertas Moderados ---------
function criarGraficoAlertasModerados() {
    const canvas = document.getElementById('monitoramento-rede');
    if (!canvas) return;

    canvas.style.width = '100%';
    canvas.height = 300;

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsMeses,
            datasets: [{
                label: 'Alertas Moderados',
                data: [3, 5, 4, 7, 4, 5], // mock por enquanto
                tension: 0.4,
                fill: false,
                borderWidth: 3,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: criarOpcoesBase('Qtd de Alertas Moderados')
    });
}

// --------- GRÁFICO 3 – Pizza: Comparação de Alertas (API) ---------
async function criarGraficoPizzaAlertas() {
    // AGORA PEGANDO O MESMO ID QUE ESTÁ NO HTML
    const canvas = document.getElementById('grafico-comparacao-alertas');
    if (!canvas) return;

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    let totalCriticos = 0;
    let totalModerados = 0;

    try {
        const resposta = await fetch("/api/joao/alertas/comparacao");

        if (!resposta.ok) {
            throw new Error("Resposta HTTP não OK: " + resposta.status);
        }

        const dados = await resposta.json();
        console.log("Comparação de alertas vinda da API:", dados);

        totalCriticos = dados.totalCriticos || 0;
        totalModerados = dados.totalModerados || 0;

    } catch (erro) {
        console.error("Erro ao carregar comparação de alertas:", erro);
        // mock se der erro
        totalCriticos = 5;
        totalModerados = 3;
    }

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Alertas Moderados', 'Alertas Críticos'],
            datasets: [{
                label: 'Comparação de Alertas',
                data: [totalModerados, totalCriticos],
                backgroundColor: [
                    'rgba(255, 214, 48, 0.7)', // moderados
                    'rgba(234, 3, 3, 0.7)'     // críticos
                ],
                borderColor: [
                    'rgba(255, 214, 48, 1)',
                    'rgba(234, 3, 3, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}