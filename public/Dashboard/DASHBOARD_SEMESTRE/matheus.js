// Configurações e Constantes Globais
const CORES = {
    verde: 'rgba(34, 197, 94, 0.8)',
    verdeBorda: 'rgba(22, 163, 74, 1)',
    vermelho: 'rgba(239, 68, 68, 0.8)',
    vermelhoBorda: 'rgba(220, 38, 38, 1)',
    laranja: 'rgba(255, 122, 0, 0.8)',
    laranjaBorda: 'rgba(211, 84, 0, 1)',
    azul: 'rgba(75, 192, 192, 0.8)',
    azulBorda: 'rgba(75, 192, 192, 1)',
    vermelhoAlerta: 'rgba(255, 0, 0, 0.8)',
    vermelhoAlertaBorda: 'rgba(255, 0, 0, 1)'
};

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Funções Utilitárias
async function buscarDados(url) {
    try {
        const resposta = await fetch(url, { cache: 'no-store' });
        if (!resposta.ok) throw new Error('Erro na requisição');
        return await resposta.json();
    } catch (erro) {
        console.error(`Erro ao buscar ${url}:`, erro);
        return null;
    }
}

function formatarLabelsMeses(dados, chaveMes = 'mes') {
    return dados.map(dado => {
        const mesNumero = parseInt(dado[chaveMes].split('-')[1]);
        return MESES[mesNumero - 1];
    });
}

// Funções de Carregamento de Dados
async function carregarKpis() {
    const dados = await buscarDados('/api/matheus/kpisSemestrais');
    if (!dados) return;

    document.getElementById('kpi-uptime').textContent = `${dados.uptime || 0}%`;
    document.getElementById('kpi-sala').textContent = dados.salaMaisAlertas || '—';
    document.getElementById('kpi-alertas').textContent = dados.totalAlertas || 0;
}

async function carregarGraficoUptime() {
    const dados = await buscarDados('/api/matheus/uptimeDowntimeSemestral');
    if (!dados) return;

    const labels = formatarLabelsMeses(dados);
    const uptime = dados.map(d => d.uptime);
    const downtime = dados.map(d => d.downtime);

    new Chart(document.getElementById('chart-uptime'), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Uptime',
                    data: uptime,
                    backgroundColor: CORES.verde,
                    borderColor: CORES.verdeBorda,
                    borderWidth: 1,
                    borderRadius: 6,
                    stack: 'total'
                },
                {
                    label: 'Downtime',
                    data: downtime,
                    backgroundColor: CORES.vermelho,
                    borderColor: CORES.vermelhoBorda,
                    borderWidth: 1,
                    borderRadius: 6,
                    stack: 'total'
                }
            ]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max: 100, stacked: true },
                x: { stacked: true }
            }
        }
    });
}

async function carregarGraficoAlertas() {
    const dados = await buscarDados('/api/matheus/alertasPorMesSemestral');
    if (!dados) return;

    const labels = formatarLabelsMeses(dados);
    const valores = dados.map(d => d.qtdAlertas);
    const maiorValor = Math.max(0, ...valores);

    // Destaque em vermelho para o mês com mais alertas
    const coresFundo = valores.map(v => v === maiorValor ? CORES.vermelhoAlerta : CORES.laranja);
    const coresBorda = valores.map(v => v === maiorValor ? CORES.vermelhoAlertaBorda : CORES.laranjaBorda);

    new Chart(document.getElementById('chart-alertas'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Alertas',
                data: valores,
                backgroundColor: coresFundo,
                borderColor: coresBorda,
                borderWidth: 1,
                borderRadius: 6,
                maxBarThickness: 36
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

async function carregarGraficoSalas() {
    const dados = await buscarDados('/api/matheus/salasMaisAlertasSemestral');
    if (!dados) return;

    const labels = dados.map(d => d.sala);
    const valores = dados.map(d => d.qtdAlertas);

    new Chart(document.getElementById('chart-salas'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Alertas',
                data: valores,
                backgroundColor: CORES.azul,
                borderColor: CORES.azulBorda,
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 52,
                maxBarThickness: 72
            }]
        },
        options: {
            indexAxis: 'y',
            maintainAspectRatio: false,
            scales: {
                x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' } },
                y: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// Funções de Interface (UI)
function configurarDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-container');

    dropdowns.forEach(drop => {
        const btn = drop.querySelector('.dropbtn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                drop.classList.toggle('active');
            });
        }
    });

    window.addEventListener('click', () => {
        dropdowns.forEach(drop => drop.classList.remove('active'));
    });
}

function carregarInfoUsuario() {
    const nomeUsuario = sessionStorage.NOME_USUARIO;
    const imgUsuario = sessionStorage.IMAGEM_USUARIO;

    const elNome = document.getElementById('nome-usuario-pagina');
    const elImg = document.getElementById('imgPerfil');

    if (elNome) elNome.innerText = nomeUsuario || 'Usuário';

    if (elImg) {
        elImg.src = (imgUsuario && imgUsuario.trim())
            ? `/uploads/${imgUsuario}`
            : '../imgs/profile-default.webp';
    }
}

// Controle do Modal de Logout
const modalLogout = document.getElementById('modalLogout');
const overlay = document.getElementById('telaOverlay');

function sairDaPagina() {
    if (modalLogout) modalLogout.style.display = 'flex';
    if (overlay) overlay.style.display = 'block';
}

function cancelarSairDaPagina() {
    if (modalLogout) modalLogout.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}

function confirmarSairDaPagina() {
    window.location.href = '../index.html';
}

// Inicialização Principal
window.onload = async () => {
    carregarInfoUsuario();
    configurarDropdowns();

    await carregarKpis();
    await carregarGraficoUptime();
    await carregarGraficoAlertas();
    await carregarGraficoSalas();
};
