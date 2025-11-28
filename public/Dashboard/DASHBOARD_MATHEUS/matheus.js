async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha na API');
  return res.json();
}

async function carregarKpis() {
  try {
    const kpis = await fetchJSON('/api/matheus/kpisSemestrais');
    const uptime = kpis.uptime || 0;
    document.getElementById('kpi-uptime').textContent = `${uptime}%`;
    document.getElementById('kpi-sala').textContent = kpis.salaMaisAlertas || '—';
    document.getElementById('kpi-alertas').textContent = kpis.totalAlertas || 0;
  } catch (e) {}
}

function mesesLabel(items, campo) {
  return items.map(i => i[campo]).map(m => {
    const [y, mo] = m.split('-');
    const nomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    return nomes[parseInt(mo,10)-1];
  });
}

async function graficoUptime() {
  try {
    const dados = await fetchJSON('/api/matheus/uptimeDowntimeSemestral');
    const labels = mesesLabel(dados, 'mes');
    const uptime = dados.map(d => d.uptime);
    const downtime = dados.map(d => d.downtime);
    const ctx = document.getElementById('chart-uptime').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Uptime', data: uptime, backgroundColor: '#3b82f6', stack: 'stack' },
          { label: 'Downtime', data: downtime, backgroundColor: '#ef4444', stack: 'stack' }
        ]
      },
      options: { scales: { y: { beginAtZero: true, max: 100, stacked: true }, x: { stacked: true } } }
    });
  } catch (e) {}
}

async function graficoAlertasMes() {
  try {
    const dados = await fetchJSON('/api/matheus/alertasPorMesSemestral');
    const labels = mesesLabel(dados, 'mes');
    const valores = dados.map(d => d.qtdAlertas);
    const ctx = document.getElementById('chart-alertas').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Alertas', data: valores, backgroundColor: '#6b7280' }] },
      options: { scales: { y: { beginAtZero: true } } }
    });
  } catch (e) {}
}

async function graficoSalasMaisAlertas() {
  try {
    const dados = await fetchJSON('/api/matheus/salasMaisAlertasSemestral');
    const labels = dados.map(d => d.sala);
    const valores = dados.map(d => d.qtdAlertas);
    const ctx = document.getElementById('chart-salas').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Alertas', data: valores, backgroundColor: '#1f2937' }] },
      options: { scales: { y: { beginAtZero: true } } }
    });
  } catch (e) {}
}

(async function init() {
  await carregarKpis();
  await graficoUptime();
  await graficoAlertasMes();
  await graficoSalasMaisAlertas();
})();
(function uiBase() {
  const dropdowns = document.querySelectorAll('.dropdown-container');
  dropdowns.forEach(drop => {
    const btn = drop.querySelector('.dropbtn');
    btn && btn.addEventListener('click', (e) => {
      e.stopPropagation();
      drop.classList.toggle('active');
    });
  });
  window.addEventListener('click', () => {
    dropdowns.forEach(drop => drop.classList.remove('active'));
  });
})();

function carregarInfos() {
  var usuario = document.getElementById('nome-usuario-pagina');
  if (usuario) usuario.innerText = sessionStorage.NOME_USUARIO;
  var imgPerfil = document.getElementById('imgPerfil');
  if (imgPerfil) {
    if (sessionStorage.IMAGEM_USUARIO && sessionStorage.IMAGEM_USUARIO.trim() !== "") {
      imgPerfil.src = `/uploads/${sessionStorage.IMAGEM_USUARIO}`;
    } else {
      imgPerfil.src = '../imgs/profile-default.webp';
    }
  }
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
  window.location.href = '../index.html'
}
