document.addEventListener("DOMContentLoaded", function () {
    criarGraficoAlertasCriticos();
    criarGraficoAlertasModerados();
    criarGraficoPizzaAlertas();
    carregarKpisAlertas();
    carregarKpiMesMaisCritico();
});

// ================== PERFIL / NOME USUÁRIO ==================

var usuario = document.getElementById('nome-usuario-pagina');
if (usuario) {
    usuario.innerText = sessionStorage.NOME_USUARIO || "Usuário";
}

var imgPerfil = document.getElementById('imgPerfil');

if (imgPerfil) {
    if (sessionStorage.IMAGEM_USUARIO && sessionStorage.IMAGEM_USUARIO.trim() !== "") {
        imgPerfil.src = `../../../uploads/${sessionStorage.IMAGEM_USUARIO}`;
    } else {
        imgPerfil.src = '../../imgs/profile-default.webp';
    }
}

// ================== CONFIG GERAIS GRÁFICOS ==================

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

// ================== GRÁFICO 1 – Alertas Críticos (mock) ==================

async function criarGraficoAlertasCriticos() {
    const canvas = document.getElementById('monitoramento-componente');
    if (!canvas) return;

    canvas.style.width = '100%';
    canvas.height = 300;

    let labels = [];
    let dados = [];

    try {
        const resposta = await fetch("/api/joao/alertas/criticos-mensais");
        const resultados = await resposta.json();

        resultados.forEach(item => {
            const [ano, mes] = item.mes.split("-");
            const nomesMes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
            labels.push(`${nomesMes[Number(mes)-1]}/${ano}`);
            dados.push(item.total);
        });

    } catch (erro) {
        console.error("Erro ao carregar alertas críticos mensais:", erro);
        labels = ['Jan','Fev','Mar','Abr','Mai','Jun'];
        dados = [0,0,0,0,0,0];
    }

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{
            label: 'Alertas Críticos',
            data: dados,
            tension: 0.4,
            fill: false,
            borderWidth: 3,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            pointRadius: 4,
            pointHoverRadius: 6
        }]},
        options: criarOpcoesBase('Qtd de Alertas Críticos')
    });
}

// ================== GRÁFICO 2 – Alertas em Atenção (mock) ==================

async function criarGraficoAlertasModerados() {
    const canvas = document.getElementById('monitoramento-rede');
    if (!canvas) return;

    canvas.style.width = '100%';
    canvas.height = 300;

    let labels = [];
    let dados = [];

    try {
        const resposta = await fetch("/api/joao/alertas/moderados-mensais");
        const resultados = await resposta.json();

        resultados.forEach(item => {
            const [ano, mes] = item.mes.split("-");
            const nomesMes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
            labels.push(`${nomesMes[Number(mes)-1]}/${ano}`);
            dados.push(item.total);
        });

    } catch (erro) {
        console.error("Erro ao carregar alertas moderados mensais:", erro);
        labels = ['Jan','Fev','Mar','Abr','Mai','Jun'];
        dados = [0,0,0,0,0,0];
    }

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{
            label: 'Alertas em Atenção',
            data: dados,
            tension: 0.4,
            fill: false,
            borderWidth: 3,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            pointRadius: 4,
            pointHoverRadius: 6
        }]},
        options: criarOpcoesBase('Qtd de Alertas em Atenção')
    });
}
// ================== GRÁFICO 3 – Pizza: Comparação de Alertas (API) ==================

async function criarGraficoPizzaAlertas() {
    const canvas = document.getElementById('grafico-comparacao-alertas');
    if (!canvas) return;

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    let totalCriticos = 0;
    let totalModerados = 0;

    try {
        const resposta = await fetch("/api/joao/alertas/comparacao");
        console.log("Status /alertas/comparacao:", resposta.status);

        if (!resposta.ok) {
            throw new Error("Resposta HTTP não OK: " + resposta.status);
        }

        const dados = await resposta.json();
        console.log("Dados comparação de alertas:", dados);

        
        totalCriticos = dados.totalCriticos || 0;
        totalModerados = dados.totalModerados || 0;

    } catch (erro) {
        console.error("Erro ao carregar comparação de alertas:", erro);
        totalCriticos = 5;
        totalModerados = 3;
    }

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Alertas em Atenção', 'Alertas Críticos'],
            datasets: [{
                label: 'Comparação de Alertas',
                data: [totalModerados, totalCriticos],
                backgroundColor: [
                    'rgba(255, 214, 48, 0.7)', 
                    'rgba(234, 3, 3, 0.7)' 
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
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}



function sairDaPagina() {
    modalLogout.style.display = 'flex';
    telaOverlay.style.display = 'block';
}

function cancelarSairDaPagina() {
    modalLogout.style.display = 'none';
    telaOverlay.style.display = 'none';
}

function confirmarSairDaPagina() {
    window.location.href = '../../../index.html'
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

// KPIs 

async function carregarKpisAlertas() {
    const kpiCriticos  = document.getElementById("kpiAelrtasCriticos");
    const kpiModerados = document.getElementById("kpiUptimeMaquinaSala");
    const kpiCompMais  = document.getElementById("kpiTaxaMaisCriticaMaquina");

    // 1) Totais de críticos e em atenção
    try {
        // Críticos 
        const respCriticos = await fetch("/api/joao/alertas/criticos");
        console.log("HTTP /alertas/criticos status:", respCriticos.status);
        const dadosCriticos = await respCriticos.json();
        console.log("JSON /alertas/criticos:", dadosCriticos);

        const totalCriticos = dadosCriticos.totalCriticos || 0;
        if (kpiCriticos) kpiCriticos.textContent = totalCriticos;

        // Moderados (atenção) 
        const respModerados = await fetch("/api/joao/alertas/moderados");
        console.log("HTTP /alertas/moderados status:", respModerados.status);
        const dadosModerados = await respModerados.json();
        console.log("JSON /alertas/moderados:", dadosModerados);

        const totalModerados = dadosModerados.totalModerados || 0;
        if (kpiModerados) kpiModerados.textContent = totalModerados;

        console.log("KPIs Crit/Atenção atualizadas:", { totalCriticos, totalModerados });

    } catch (erro) {
        console.error("Erro ao carregar totais de críticos/atenção:", erro);
        if (kpiCriticos)  kpiCriticos.textContent  = "-";
        if (kpiModerados) kpiModerados.textContent = "-";
    }

    //  2 Componente mais crítico 
    try {
        const respComponente = await fetch("/api/joao/alertas/componente-mais-critico");
        console.log("HTTP /alertas/componente-mais-critico status:", respComponente.status);
        const dadosComponente = await respComponente.json();
        console.log("JSON /alertas/componente-mais-critico:", dadosComponente);

        const nomeComponenteMaisCritico = dadosComponente.nomeComponente || "Sem dados";
        const qtdAlertasComponente      = dadosComponente.totalAlertasCriticos || 0;

        if (kpiCompMais) {
           
            kpiCompMais.textContent = `${nomeComponenteMaisCritico}`;
        }

        console.log("KPI Componente mais crítico atualizada:", {
            nomeComponenteMaisCritico,
            qtdAlertasComponente
        });

    } catch (erro) {
        console.error("Erro ao carregar componente mais crítico:", erro);
        if (kpiCompMais) kpiCompMais.textContent = "Sem dados";
    }
}
async function carregarKpiMesMaisCritico() {
    const kpiMesCritico = document.getElementById("kpiMesMaisCritico");
    if (!kpiMesCritico) {
        console.warn("Elemento #kpiMesMaisCritico não encontrado no HTML.");
        return;
    }

    try {
        const resposta = await fetch("/api/joao/alertas/mes-mais-critico");

        if (!resposta.ok) {
            throw new Error("Resposta HTTP não OK: " + resposta.status);
        }

        const dados = await resposta.json();
        console.log("JSON /alertas/mes-mais-critico:", dados);

        if (!dados || !dados.mes) {
            kpiMesCritico.textContent = "Sem dados";
            return;
        }

      
        const [ano, mesNumero] = dados.mes.split("-");
        const nomesMes = [
            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
            "Jul", "Ago", "Set", "Out", "Nov", "Dez"
        ];
        const mesIndex = Number(mesNumero) - 1;
        const mesNome = nomesMes[mesIndex] || dados.mes;

        const total = dados.totalAlertasCriticos || 0;

        kpiMesCritico.textContent = `${mesNome}/${ano} (${total} alertas)`;

    } catch (erro) {
        console.error("Erro ao carregar KPI de mês mais crítico:", erro);
        kpiMesCritico.textContent = "Erro";
    }
}
