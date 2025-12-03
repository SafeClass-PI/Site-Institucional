

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

  carregarInfos();
});
function fecharModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

async function carregarInfos() {
  await carregarSalas();
}


    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;

    var imgPerfil = document.getElementById('imgPerfil');

    if (imgPerfil) {
        if (sessionStorage.IMAGEM_USUARIO && sessionStorage.IMAGEM_USUARIO.trim() !== "") {
            imgPerfil.src = `../../../uploads/${sessionStorage.IMAGEM_USUARIO}`;
        } else {
            imgPerfil.src = '../imgs/profile-default.webp';
        }
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

    selectSala.innerHTML = '<option value="" disabled selected>Selecione a Sala</option>';

    if (!Array.isArray(salas) || salas.length === 0) {
      selectSala.innerHTML = '<option value="" disabled selected>Nenhuma Sala Encontrada</option>';
      if (kpiStatus) kpiStatus.innerHTML = 'Nenhuma sala disponível para filtro.';
      return;

      
    }

    
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

    selectSala.addEventListener('change', selecionarSala);

    if (selectSala.options.length > 1) {
      selectSala.value = selectSala.options[1].value;
      selecionarSala(); 
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

  const nomeSalaSelecionada = selectSala.options[selectSala.selectedIndex].text;
  const salaTexto = document.getElementById('salaSelecionadaTexto');
  if (salaTexto) salaTexto.textContent = nomeSalaSelecionada;

  const elementosSala = document.querySelectorAll('.salaInfoId');
  elementosSala.forEach(el => {
    el.textContent = salaId;
  });

  const resposta = await fetch(`/api/maquinas?salaId=${salaId}`);
  const { maquinas } = await resposta.json();

  if (maquinas.length > 0) {
    await carregarMaquinasPorSala(salaId);
    carregarKpiMaquinaCritica(salaId);
    carregarMedianaCPU(salaId);
    carregarTotalAlertas(salaId);
    carregarUltimosAlertas(salaId);
    carregarRankingFalhas(salaId);
  }
}




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
      kpiElement.innerHTML = '<div style="font-weight:600; color:#888;">Nenhum registro</div>';

    }
  } catch (error) {
    console.error('Erro ao buscar KPI da máquina crítica:', error);
    const kpiElement = document.getElementById('kpiStatusMaquinaEscola');
    if (kpiElement) kpiElement.innerHTML = 'Erro ao carregar dados do KPI.';
  }
}


async function carregarMedianaCPU(idSala) {
  const el = document.getElementById('kpiUptimeMaquinaSala');
  if (!el) return;

  try {
    const resp = await fetch(`/api/sala/mediana?sala=${encodeURIComponent(idSala)}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const texto = await resp.text();
    let mediana = null;

    
    if (!isNaN(texto)) {
      mediana = Number(texto);
    } else {
   
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

    
    el.textContent = mediana !== null && !Number.isNaN(mediana) ? `${mediana}%` : '—';
    el.style.marginTop = '30px'; 
    el.style.fontSize = '1.6em';
    el.style.fontWeight = 'bold';
    el.style.color = '#2c3e50';
    el.style.textAlign = 'center';

  } catch (e) {
    console.error('Erro ao carregar mediana:', e);
    el.textContent = 'Nenhum registro';
    el.style.color = '#888';

  }
}



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
  const el = document.getElementById('kpiTotalAlertasSala');
  if (!el) return;

  try {
    const resp = await fetch(`/api/sala/alertas?sala=${idSala}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const dados = await resp.json();

    el.textContent = dados.totalAlertas ?? '—';
  } catch (e) {
    console.error('Erro ao carregar total de alertas:', e);
    el.textContent = 'Nenhum registro';

  }
}

async function carregarUltimosAlertas(idSala) {
  const container = document.getElementById('alertasMaquina');
  if (!container) return;

  try {
    const resp = await fetch(`/api/sala/ultimos-alertas?sala=${idSala}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const alertas = await resp.json();

    container.innerHTML = ''; 

    if (!Array.isArray(alertas) || alertas.length === 0) {
      container.innerHTML = '<p style="text-align:center;">Nenhum alerta recente</p>';
      return;
    }

    alertas.forEach(alerta => {
      const card = document.createElement('div');
      const nivelClasse = alerta.nivel.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      card.className = `card-alerta ${nivelClasse}`;



const icone = alerta.nivel === 'Crítico' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-triangle-exclamation';

if (alerta.nivel == 'Crítico'){
  card.innerHTML = `
  <div style="display: flex; flex-direction: column; gap: 2px; font-size: 12px; padding: 4px;">
    <div style="display: flex; align-items: center; gap: 4px; margin-top: -2px; margin-bottom: 0;">
      <i class="${icone}" style="color: red; font-size: 13px; margin-top: -2px;"></i>
      <strong style="font-size: 12px; margin-top: -2px;">${alerta.nivel}</strong>
    </div>
    <span><b>Máquina:</b> ${alerta.maquina} <b>Sala:</b> ${alerta.sala}</span>
    <span><b>Momento:</b> ${alerta.horario}</span>
    <span><b>CPU no momento:</b> ${alerta.cpu !== undefined ? alerta.cpu + '%' : '—'}</span>
  </div>
`;
}
else {
  card.innerHTML = `
  <div style="display: flex; flex-direction: column; gap: 2px; font-size: 12px; padding: 4px;">
    <div style="display: flex; align-items: center; gap: 4px; margin-top: -2px; margin-bottom: 0;">
      <i class="${icone}" style="color: orange; font-size: 13px; margin-top: -2px;"></i>
      <strong style="font-size: 12px; margin-top: -2px;">${alerta.nivel}</strong>
    </div>
    <span><b>Máquina:</b> ${alerta.maquina} <b>Sala:</b> ${alerta.sala}</span>
    <span><b>Momento:</b> ${alerta.horario}</span>
    <span><b>CPU no momento:</b> ${alerta.cpu !== undefined ? alerta.cpu + '%' : '—'}</span>
  </div>
`;
}


      container.appendChild(card);
    });
  } catch (e) {
    console.error('Erro ao carregar últimos alertas:', e);
    container.innerHTML = '<p style="text-align:center;">Erro ao carregar alertas</p>';
  }
}

async function carregarMaquinasPorSala(salaId) {
  const selectMaquina = document.getElementById('componente-grafico');
  if (!selectMaquina) return;

  try {
    const resp = await fetch(`/api/maquinas?salaId=${salaId}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const { maquinas } = await resp.json();

    selectMaquina.innerHTML = '<option value="" disabled selected>Selecione a Máquina</option>';

    if (!Array.isArray(maquinas) || maquinas.length === 0) {
      selectMaquina.innerHTML = '<option value="" disabled selected>Nenhuma máquina encontrada</option>';
      selectMaquina.disabled = true;
      mostrarMensagemSemDados(); 
      limparKPIs();
      return;
    }

    selectMaquina.disabled = false;

    
    maquinas.forEach(m => {
      const option = document.createElement('option');
      option.value = m.idMaquina;
      option.text = `Máquina ${m.idMaquina}`;
      selectMaquina.appendChild(option);
    });
  } catch (e) {
    console.error('Erro ao carregar máquinas da sala:', e);
    selectMaquina.disabled = true;
    mostrarMensagemSemDados();
    return;
  }

  
  if (selectMaquina.options.length > 1) {
    selectMaquina.value = selectMaquina.options[1].value;
    trocarComponente(); 
  }
}




function trocarComponente() {
  const selectMaquina = document.getElementById('componente-grafico');
  const maquinaId = selectMaquina?.value;

  if (maquinaId) {
    carregarGrafico(maquinaId); 
  }
}








let graficoCpu = null;
let maquinaAtual = null;

async function carregarGrafico(maquinaId) {
  const salaId = document.getElementById('escolha-sala')?.value;

  const response = await fetch(`/api/cpu/capturas?salaId=${salaId}&maquinaId=${maquinaId}`);
  const dados = await response.json();

  if (!dados || dados.length === 0) {
    mostrarMensagemSemDados();
    return;
  }

  const labels = dados.map(d => {
    const data = new Date(d.dtCaptura);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  });

  const valores = dados.map(d => d.registro);

  const labelsLimitados = labels.slice(-10);
  const valoresLimitados = valores.slice(-10);

  const ctx = document.getElementById('monitoramento-componente').getContext('2d');

  if (!graficoCpu || maquinaAtual !== maquinaId) {
    if (graficoCpu) graficoCpu.destroy();
    graficoCpu = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labelsLimitados,
        datasets: [{
          label: `Uso da CPU (Sala ${salaId}, Máquina ${maquinaId})`,
          data: valoresLimitados,
          borderColor: 'orange',
          backgroundColor: 'rgba(255,165,0,0.2)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: 'white',
          pointBorderColor: 'orange',
          pointHoverRadius: 7,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 100
          }
        },
        plugins: {
          annotation: {
            annotations: {
              linhaCritico: {
                type: 'line',
                scaleID: 'y',
                value: 85,
                borderColor: 'red',
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  display: true,
                  content: 'Crítico',
                  position: 'start',
                  yAdjust: -4,
                  color: '#fff',
                  backgroundColor: '#e74c3c',
                  borderColor: '#c0392b',
                  borderWidth: 1,
                  borderRadius: 4,
                  font: {
                    size: 10,
                    weight: 'bold'
                  },
                  padding: 4
                }
              },
              linhaAtencao: {
                type: 'line',
                scaleID: 'y',
                value: 70,
                borderColor: 'orange',
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  display: true,
                  content: 'Atenção',
                  position: 'start',
                  yAdjust: 13,
                  color: '#fff',
                  backgroundColor: '#f39c12',
                  borderColor: '#e67e22',
                  borderWidth: 1,
                  borderRadius: 4,
                  font: {
                    size: 10,
                    weight: 'bold'
                  },
                  padding: 4
                }
              },
            }
          }
        }
      }
    });
    maquinaAtual = maquinaId;
  } else {
    graficoCpu.data.labels = labelsLimitados;
    graficoCpu.data.datasets[0].data = valoresLimitados;
    graficoCpu.update();
  }



  function mostrarMensagemSemDados() {
    const canvas = document.getElementById('monitoramento-componente');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#888";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Sem dados disponíveis para esta máquina nesta sala", canvas.width / 2, canvas.height / 2);
  }


  function limparKPIs() {
    const kpiCritica = document.getElementById('kpiStatusMaquinaEscola');
    const kpiMediana = document.getElementById('kpiUptimeMaquinaSala');
    const kpiAlertas = document.getElementById('kpiTotalAlertasSala');
    const alertasContainer = document.getElementById('alertasMaquina');

    if (kpiCritica) kpiCritica.innerHTML = '<div style="font-weight:600; color:#888;">Nenhum registro</div>';
    if (kpiMediana) {
      kpiMediana.textContent = 'Nenhum registro';
      kpiMediana.style.color = '#888';
    }
    if (kpiAlertas) kpiAlertas.textContent = 'Nenhum registro';
    if (alertasContainer) alertasContainer.innerHTML = '<p style="text-align:center;">Nenhum alerta recente</p>';
  }


  setInterval(() => {
    const maquinaId = document.getElementById('componente-grafico')?.value;
    if (maquinaId) carregarGrafico(maquinaId);
  }, 30000)
}

setInterval(() => {
  const salaId = document.getElementById('escolha-sala')?.value;
  if (!salaId) return;

  carregarKpiMaquinaCritica(salaId);
  carregarMedianaCPU(salaId);
  carregarTotalAlertas(salaId);
  carregarUltimosAlertas(salaId);
}, 30000); 

async function carregarRankingFalhas(salaId) {
  const canvas = document.getElementById('monitoramento-rede');
  if (!canvas) {
    console.warn('Canvas #monitoramento-rede não encontrado');
    return;
  }

  try {
    const resp = await fetch(`/api/ranking?salaId=${salaId}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const dados = await resp.json();

    const ctx = canvas.getContext('2d');
    if (!Array.isArray(dados) || dados.length === 0) {
      const canvas = document.getElementById('monitoramento-rede');
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "bold 14px Arial";
      ctx.fillStyle = "#888";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Sem dados disponíveis para esta sala", canvas.width / 2, canvas.height / 2);

      if (window.graficoRanking) {
        window.graficoRanking.destroy();
        window.graficoRanking = null;
      }
      return;
    }




    const maquinas = dados.map(d => d.maquina);
    const falhas = dados.map(d => Number(d.falhas) || 0);

    const cores = falhas.map(qtd =>
      qtd > 100 ? 'rgba(231,76,60,0.7)' : qtd > 50 ? 'rgba(243,156,18,0.7)' : 'rgba(46,204,113,0.7)'
    );

    const bordas = falhas.map(qtd =>
      qtd > 100 ? '#c0392b' : qtd > 50 ? '#e67e22' : '#27ae60'
    );

    if (window.graficoRanking) {
      window.graficoRanking.data.labels = maquinas;
      window.graficoRanking.data.datasets[0].data = falhas;
      window.graficoRanking.data.datasets[0].backgroundColor = cores;
      window.graficoRanking.data.datasets[0].borderColor = bordas;
      window.graficoRanking.update();
      return;
    }

    window.graficoRanking = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: maquinas,
        datasets: [{
          label: 'Falhas Críticas por Máquina',
          data: falhas,
          backgroundColor: cores,
          borderColor: bordas,
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 12,
                weight: 'bold'
              },
              color: '#2c3e50'
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            precision: 0,
            ticks: {
              font: {
                size: 12
              },
              color: '#2c3e50'
            },
            grid: {
              color: '#ecf0f1'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#2c3e50',
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            callbacks: {
              label: context => `Falhas: ${context.raw}`
            }
          }
        }
      }
    });
  } catch (e) {
    console.error('Erro ao carregar ranking de falhas:', e);
  }
}

setInterval(() => {
  const salaId = document.getElementById('escolha-sala')?.value;
  if (salaId) carregarRankingFalhas(salaId);
}, 30000);
