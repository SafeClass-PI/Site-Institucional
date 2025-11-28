// ===== Utils e navegação =====
function sairDaPagina() {
  const modalLogout = document.getElementById('modalLogout');
  const telaOverlay = document.getElementById('telaOverlay');
  if (modalLogout && telaOverlay) {
    modalLogout.style.display = 'flex';
    telaOverlay.style.display = 'block';
  }
}
function cancelarSairDaPagina() {
  const modalLogout = document.getElementById('modalLogout');
  const telaOverlay = document.getElementById('telaOverlay');
  if (modalLogout && telaOverlay) {
    modalLogout.style.display = 'none';
    telaOverlay.style.display = 'none';
  }
}
function confirmarSairDaPagina() {
  window.location.href = '../index.html'
}

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

function atualizarDataHora() {
  const agora = new Date();
  const data = agora.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const elementoDataHora = document.getElementById('dataHora');
  if (elementoDataHora) elementoDataHora.textContent = `${data}`;
}
setInterval(atualizarDataHora, 1000);

// ===== Modais de info =====
document.addEventListener("DOMContentLoaded", () => {
  atualizarDataHora();

  const infoIcon = document.getElementById("infoIcon");
  const modal = document.getElementById("kpiModal");
  if (infoIcon && modal) {
    infoIcon.addEventListener("click", () => modal.style.display = "block");
  }

  const infoIcons = document.querySelectorAll(".infoIcon");
  infoIcons.forEach(icon => {
    icon.addEventListener("click", () => {
      const targetId = icon.getAttribute("data-target");
      const m = document.getElementById(targetId);
      if (m) m.style.display = "block";
    });
  });

  // Inicialização principal
  carregarInfos();
});
function fecharModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// ===== Salas e KPIs =====
async function carregarInfos() {
  await carregarSalas();
}

async function carregarSalas() {
  try {
    const response = await fetch("/salas/listar");
    if (response.status === 204) return setSelectErro('Nenhuma Sala Encontrada');
    if (!response.ok) throw new Error('Status ' + response.status);

    const salas = await response.json();
    const selectSala = document.getElementById('escolha-sala');
    const kpiStatus = document.getElementById('kpiStatusMaquinaEscola');

    if (!selectSala) return console.error('Elemento #escolha-sala não encontrado.');

    // Placeholder
    selectSala.innerHTML = '<option value="" disabled selected>Selecione a Sala</option>';

    if (!Array.isArray(salas) || salas.length === 0) {
      selectSala.innerHTML = '<option value="" disabled selected>Nenhuma Sala Encontrada</option>';
      if (kpiStatus) kpiStatus.innerHTML = 'Nenhuma sala disponível para filtro.';
      return;
    }

    // Popular options
    salas.forEach(sala => {
      const idSala = sala.idSala || sala.id || sala.ID;
      const nomeSala = sala.nomeSala || sala.nome || sala.Nome;
      if (idSala !== undefined && nomeSala !== undefined) {
        const option = document.createElement('option');
        option.value = idSala;
        const nomeLimpo = String(nomeSala).replace(/^sala\s*/i, '').trim();
        option.text = `Sala ${nomeLimpo}`;
        selectSala.appendChild(option);
      }
    });

    // Listener para mudança de sala
    selectSala.addEventListener('change', selecionarSala);

    // Seleciona a primeira sala e carrega KPIs
    if (selectSala.options.length > 1) {
      selectSala.value = selectSala.options[1].value;
      selecionarSala(); // dispara carregamento
    }
  } catch (error) {
    console.error('Erro ao carregar salas:', error);
    setSelectErro('ERRO AO CARREGAR');
    const kpiStatus = document.getElementById('kpiStatusMaquinaEscola');
    if (kpiStatus) kpiStatus.innerHTML = 'Erro: Falha ao carregar lista de salas.';
  }
}
function setSelectErro(texto) {
  const selectSala = document.getElementById('escolha-sala');
  if (selectSala) selectSala.innerHTML = `<option value="" disabled selected>${texto}</option>`;
}

async function selecionarSala() {
  const selectSala = document.getElementById('escolha-sala');
  const salaId = selectSala.value;

  const resposta = await fetch(`/api/maquinas?salaId=${salaId}`);
  const { maquinas } = await resposta.json();

  if (maquinas.length > 0) {
  const maquinaCritica = maquinas[0]; // ou lógica para escolher
  await carregarMaquinasPorSala(salaId);

  carregarKpiMaquinaCritica(salaId);
  carregarMedianaCPU(salaId);
  carregarTotalAlertas(salaId);
  carregarUltimosAlertas(salaId);
}

}


// Máquina mais crítica
async function carregarKpiMaquinaCritica(idSala) {
  try {
    const response = await fetch(`/api/maquina-critica/${idSala}`);
    if (!response.ok) throw new Error('Erro ao buscar KPI: ' + response.statusText);

    const dadosKpi = await response.json();
    const kpiElement = document.getElementById('kpiStatusMaquinaEscola');
    if (!kpiElement) return;

    if (Array.isArray(dadosKpi) && dadosKpi.length > 0 && dadosKpi[0].maquina) {
      const maquina = dadosKpi[0];
      kpiElement.innerHTML = `
        <div style="
          display:flex; flex-direction:column; align-items:flex-start; justify-content:center;
          padding:6px 10px; font-size:0.8em; text-align:left; line-height:1.2; width:100%; height:100%;
          box-sizing:border-box; overflow:hidden;">
          <div style="font-weight:600; color:#2c3e50;">${maquina.maquina}</div>
          <div style="margin-top:4px;">
            Falhas: <span style="font-weight:bold; color:#c0392b;">${maquina.totalFalhas}</span>
          </div>
        </div>`;
    } else {
      kpiElement.innerHTML = `
        <div style="
          display:flex; flex-direction:column; align-items:flex-start; justify-content:center;
          padding:6px 10px; font-size:0.8em; text-align:left; line-height:1.2; width:100%; height:100%;
          box-sizing:border-box; overflow:hidden;">
          <div style="font-weight:600; color:#2c3e50;">Nenhuma máquina crítica</div>
        </div>`;
    }
  } catch (error) {
    console.error('Erro ao buscar KPI da máquina crítica:', error);
    const kpiElement = document.getElementById('kpiStatusMaquinaEscola');
    if (kpiElement) kpiElement.innerHTML = 'Erro ao carregar dados do KPI.';
  }
}

// Mediana CPU dinâmica (lê número puro ou JSON)
async function carregarMedianaCPU(idSala) {
  const el = document.getElementById('kpiUptimeMaquinaSala');
  if (!el) return;

  try {
    const resp = await fetch(`/api/sala/mediana?sala=${encodeURIComponent(idSala)}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const texto = await resp.text();
    let mediana = null;

    // Tenta converter como número direto
    if (!isNaN(texto)) {
      mediana = Number(texto);
    } else {
      // Tenta interpretar como JSON
      try {
        const json = JSON.parse(texto);
        if (Array.isArray(json) && json.length > 0 && 'medianaCPU' in json[0]) {
          mediana = json[0].medianaCPU;
        } else if (typeof json === 'object' && 'medianaCPU' in json) {
          mediana = json.medianaCPU;
        }
      } catch (err) {
        console.warn('Formato inesperado da resposta da mediana:', texto);
      }
    }

    // Aplica estilo diretamente no elemento
    el.textContent = mediana !== null && !Number.isNaN(mediana) ? `${mediana}%` : '—';
    el.style.marginTop = '30px'; // desce mais
    el.style.fontSize = '1.6em';
    el.style.fontWeight = 'bold';
    el.style.color = '#2c3e50';
    el.style.textAlign = 'center';
    // opcional: centraliza dentro da KPI
  } catch (e) {
    console.error('Erro ao carregar mediana:', e);
    el.textContent = '—';
  }
}


// ===== Relatório =====
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnRelatorio');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    try {
      const sala = document.getElementById('escolha-sala').value;
      const resp = await fetch(`/api/relatorio/pdf?sala=${encodeURIComponent(sala)}`);
      if (!resp.ok) throw new Error('Erro ao gerar relatório');

      const blob = await resp.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Relatorio_${sala}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      alert('Não foi possível gerar o relatório');
      console.error(err);
    }
  });
});


async function carregarTotalAlertas(idSala) {
  const el = document.getElementById('kpiTotalAlertasSala'); // 👈 mesmo ID do HTML
  if (!el) return;

  try {
    const resp = await fetch(`/api/sala/alertas?sala=${idSala}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const dados = await resp.json();

    el.textContent = dados.totalAlertas ?? '—';
  } catch (e) {
    console.error('Erro ao carregar total de alertas:', e);
    el.textContent = '—';
  }
}

async function carregarUltimosAlertas(idSala) {
  const container = document.getElementById('alertasMaquina');
  if (!container) return;

  try {
    const resp = await fetch(`/api/sala/ultimos-alertas?sala=${idSala}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const alertas = await resp.json();

    container.innerHTML = ''; // limpa antes de preencher

    if (!Array.isArray(alertas) || alertas.length === 0) {
      container.innerHTML = '<p style="text-align:center;">Nenhum alerta recente</p>';
      return;
    }

    alertas.forEach(alerta => {
      const card = document.createElement('div');
      const nivelClasse = alerta.nivel.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      card.className = `card-alerta ${nivelClasse}`;



      const icone = alerta.nivel === 'Crítico' ? '🔥' : '⚠️';

      card.innerHTML = `
  <strong>${icone} ${alerta.nivel}</strong>
  <div>
    <span><b>Máquina:</b> ${alerta.maquina}  <b>Sala:</b> ${alerta.sala}</span>
  </div>
  <span><b>Momento:</b> ${alerta.horario}</span>
`;





      container.appendChild(card);
    });
  } catch (e) {
    console.error('Erro ao carregar últimos alertas:', e);
    container.innerHTML = '<p style="text-align:center;">Erro ao carregar alertas</p>';
  }
}

async function carregarMaquinasPorSala(salaId) {
  try {
    const resp = await fetch(`/api/maquinas?salaId=${salaId}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const { maquinas } = await resp.json();

    const selectMaquina = document.getElementById('componente-grafico');
    if (!selectMaquina) return;

    // Limpa opções antigas
    selectMaquina.innerHTML = '<option value="" disabled selected>Selecione a Máquina</option>';

    if (!Array.isArray(maquinas) || maquinas.length === 0) {
      selectMaquina.innerHTML = '<option value="" disabled selected>Nenhuma máquina encontrada</option>';
      return;
    }

    // Popula com as máquinas da sala
    maquinas.forEach(m => {
      const option = document.createElement('option');
      option.value = m.idMaquina;   // ou m.nome, dependendo do que você quer usar
      option.text = `Máquina ${m.idMaquina}`; // ou `${m.marca} - ${m.ip}`
      selectMaquina.appendChild(option);
    });
  } catch (e) {
    console.error('Erro ao carregar máquinas da sala:', e);
  }
}

