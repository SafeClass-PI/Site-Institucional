const database = require('../databasesFelipe/config'); // conexão padrão
const MaquinaModel = require('./maquinaModel');


// Conta todos os alertas de CPU da sala
async function obterTotalAlertasCPU(idSala) {
  const sql = `
    SELECT COUNT(a.idAlerta) AS totalAlertas
    FROM Sala s
    JOIN Maquina m ON s.idSala = m.fkSala
    JOIN Componente c ON m.idMaquina = c.fkMaquina
    JOIN Captura cap ON c.idComponente = cap.fkComponente
    JOIN Parametro p ON c.idComponente = p.fkComponente
    JOIN Alerta a ON a.fkCaptura = cap.idCaptura AND a.fkParametro = p.idParametro
    WHERE s.idSala = ${idSala}
      AND c.nome = 'CPU'; -- ajuste conforme o nome da coluna que identifica CPU
  `;

  const resultado = await database.executar(sql);
  return resultado.length > 0 ? resultado[0].totalAlertas : 0;
}

// Calcula a mediana (aqui usamos AVG como aproximação) do uso de CPU
async function obterMedianaCPU(idSala) {
  const sql = `
    SELECT ROUND(AVG(cap.registro),0) AS medianaCPU
    FROM Sala s
    JOIN Maquina m ON s.idSala = m.fkSala
    JOIN Componente c ON m.idMaquina = c.fkMaquina
    JOIN Captura cap ON c.idComponente = cap.fkComponente
    WHERE s.idSala = ${idSala}
      AND c.nome = 'CPU';
  `;

  const resultado = await database.executar(sql);
  return resultado.length > 0 ? resultado[0].medianaCPU : null;
}

// Função principal que retorna os dados da sala
async function obterDadosSala(salaId, data) {
  const maquinaCritica = await MaquinaModel.buscarMaquinaCritica(salaId);
  const totalAlertas = await AlertaModel.buscarTotalAlertas(salaId);
  const medianaCPU = await CpuModel.buscarMedianaCPU(salaId);
  const evolucaoCPU = await CpuModel.buscarEvolucaoCPU(salaId, maquinaCritica.idMaquina);
  const rankingFalhas = await RankingModel.buscarRankingPorSala(salaId);

  return {
    sala: salaId,
    data,
    maquinaCritica: {
      nome: `Máquina ${maquinaCritica.idMaquina}`,
      falhas: maquinaCritica.totalFalhas
    },
    totalAlertas,
    medianaCPU,
    statusEvolucao: calcularStatusEvolucao(evolucaoCPU), // opcional
    evolucaoCPU: evolucaoCPU.map(reg => ({
      horario: new Date(reg.dtCaptura).toLocaleTimeString('pt-BR'),
      uso: reg.registro
    })),
    rankingFalhas: rankingFalhas.map(m => ({
      maquina: m.maquina,
      falhas: m.falhas
    }))
  };
}

async function obterUltimosAlertas(idSala) {
  const sql = `
    SELECT 
      p.nivel AS nivel,
      m.idMaquina AS maquina,
      DATE_FORMAT(cap.dtCaptura, '%d/%m/%Y %H:%i') AS horario,
      s.nome AS sala
    FROM Alerta a
    JOIN Captura cap ON a.fkCaptura = cap.idCaptura
    JOIN Componente c ON cap.fkComponente = c.idComponente
    JOIN Maquina m ON c.fkMaquina = m.idMaquina
    JOIN Sala s ON m.fkSala = s.idSala
    JOIN Parametro p ON a.fkParametro = p.idParametro
    WHERE s.idSala = ${idSala}
      AND c.nome = 'CPU'
    ORDER BY cap.dtCaptura DESC
    LIMIT 10;
  `;
  return await database.executar(sql);
}

module.exports = { obterDadosSala, obterMedianaCPU, obterTotalAlertasCPU, obterUltimosAlertas };
