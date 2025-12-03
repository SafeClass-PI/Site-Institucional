document.addEventListener("DOMContentLoaded", function () {
    criarGraficoAlertasCriticos();
    criarGraficoAlertasModerados();
    criarGraficoPizzaAlertas();
    carregarKpisAlertas();
    carregarKpiMesMaisCritico();
    dropDownsSideBar();
});

// PERFIL
var usuario = document.getElementById('nome-usuario-pagina');
if (usuario) {
    usuario.innerText = sessionStorage.NOME_USUARIO || "Usuário";
}

var imgPerfil = document.getElementById('imgPerfil');
if (imgPerfil) {
    if (sessionStorage.IMAGEM_USUARIO && sessionStorage.IMAGEM_USUARIO.trim() !== "") {
        imgPerfil.src = `../../../uploads/${sessionStorage.IMAGEM_USUARIO}`;
    } else {
        imgPerfil.src = '../imgs/profile-default.webp';
    }
}

// Opções base Chart.js
function criarOpcoesBase(tituloY) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true }
        },
        scales: {
            x: { title: { display: true, text: 'Meses' } },
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
                title: { display: true, text: tituloY }
            }
        }
    };
}

// ================== GRÁFICO 1 – Alertas Críticos ==================
async function criarGraficoAlertasCriticos() {
    const canvas = document.getElementById('monitoramento-componente');
    if (!canvas) return;

    let labels = [];
    let dados = [];

    try {
        const resposta = await fetch("/api/joao/alertas/criticos-mensais");
        const resultados = await resposta.json();

        resultados.forEach(item => {
            const [ano, mes] = item.mes.split("-");
            const nomesMes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            labels.push(`${nomesMes[Number(mes) - 1]}/${ano}`);
            dados.push(item.total);
        });

    } catch (erro) {
        console.error("Erro ao carregar alertas críticos mensais:", erro);
    }

    new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Alertas Críticos',
                data: dados,
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

// ================== GRÁFICO 2 – Alertas Moderados ==================
async function criarGraficoAlertasModerados() {
    const canvas = document.getElementById('monitoramento-rede');
    if (!canvas) return;

    let labels = [];
    let dados = [];

    try {
        const resposta = await fetch("/api/joao/alertas/moderados-mensais");
        const resultados = await resposta.json();

        resultados.forEach(item => {
            const [ano, mes] = item.mes.split("-");
            const nomesMes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            labels.push(`${nomesMes[Number(mes) - 1]}/${ano}`);
            dados.push(item.total);
        });

    } catch (erro) {
        console.error("Erro ao carregar alertas moderados mensais:", erro);
    }

    new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Alertas em Atenção',
                data: dados,
                tension: 0.4,
                fill: false,
                borderWidth: 3,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: criarOpcoesBase('Qtd de Alertas em Atenção')
    });
}

// ================== GRÁFICO 3 – Pizza ==================
async function criarGraficoPizzaAlertas() {
    const canvas = document.getElementById('grafico-comparacao-alertas');
    if (!canvas) return;

    let totalCriticos = 0;
    let totalModerados = 0;

    try {
        const resposta = await fetch("/api/joao/alertas/comparacao");
        const dados = await resposta.json();
        totalCriticos = dados.totalCriticos || 0;
        totalModerados = dados.totalModerados || 0;
    } catch (erro) {
        console.error("Erro ao carregar comparação de alertas:", erro);
    }

    new Chart(canvas.getContext('2d'), {
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
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

// ============ KPIs ==================
async function carregarKpisAlertas() {
    const kpiCriticos = document.getElementById("kpiAelrtasCriticos");
    const kpiModerados = document.getElementById("kpiUptimeMaquinaSala");
    const kpiCompMais = document.getElementById("kpiTaxaMaisCriticaMaquina");

    try {
        const respCriticos = await fetch("/api/joao/alertas/criticos");
        const dadosCriticos = await respCriticos.json();
        if (kpiCriticos) kpiCriticos.textContent = dadosCriticos.totalCriticos || 0;

        const respModerados = await fetch("/api/joao/alertas/moderados");
        const dadosModerados = await respModerados.json();
        if (kpiModerados) kpiModerados.textContent = dadosModerados.totalModerados || 0;

    } catch {
        if (kpiCriticos) kpiCriticos.textContent = "-";
        if (kpiModerados) kpiModerados.textContent = "-";
    }

    try {
        const respComponente = await fetch("/api/joao/alertas/componente-mais-critico");
        const dados = await respComponente.json();
        if (kpiCompMais) kpiCompMais.textContent = dados.nomeComponente || "Sem dados";
    } catch {
        if (kpiCompMais) kpiCompMais.textContent = "Sem dados";
    }
}

async function carregarKpiMesMaisCritico() {
    const kpiMesCritico = document.getElementById("kpiMesMaisCritico");
    if (!kpiMesCritico) return;

    try {
        const resposta = await fetch("/api/joao/alertas/mes-mais-critico");
        const dados = await resposta.json();

        if (!dados || !dados.mes) {
            kpiMesCritico.textContent = "Sem dados";
            return;
        }

        const [ano, mesNumero] = dados.mes.split("-");
        const nomesMes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const mesNome = nomesMes[Number(mesNumero) - 1] || dados.mes;

        kpiMesCritico.textContent = `${mesNome}/${ano} (${dados.totalAlertasCriticos || 0} alertas)`;

    } catch {
        kpiMesCritico.textContent = "Erro";
    }
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