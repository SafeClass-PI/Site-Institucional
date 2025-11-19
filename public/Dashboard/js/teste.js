

function graficoMonitoramentoComponente() {

    const ctx = document.getElementById('monitoramento-componente').getContext('2d');

    const data = {
        labels: ['14:00:00', '14:00:10', '14:00:20', '14:00:30', '14:00:40', '14:00:50', '14:00:60', '14:00:70'],
        datasets: [{
            label: 'Time Admitted',
            data: [21, 25, 24, 23, 24, 34, 46, 95],
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