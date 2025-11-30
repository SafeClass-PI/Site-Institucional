const database = require('../databasesFelipe/config'); // conexão padrão
const MaquinaModel = require('./maquinaModel');

// Conta todos os alertas de CPU da sala
async function obterTotalAlertasCPU(idSala) {
  const sql = `
    SELECT COUNT(a.idAlerta) AS totalAlertas
    FROM sala s
    JOIN maquina m ON s.idSala = m.fkSala
    JOIN componente c ON m.idMaquina = c.fkMaquina
    JOIN captura cap ON c.idComponente = cap.fkComponente
    JOIN parametro p ON c.idComponente = p.fkComponente
    JOIN alerta a ON a.fkCaptura = cap.idCaptura AND a.fkParametro = p.idParametro
    WHERE s.idSala = ${idSala}
      AND c.nome = 'CPU';
  `;
  const resultado = await database.executar(sql);
  return resultado.length > 0 ? resultado[0].totalAlertas : 0;
}

// Calcula a mediana (aqui usamos AVG como aproximação) do uso de CPU
async function obterMedianaCPU(idSala) {
  const sql = `
    SELECT ROUND(AVG(cap.registro),0) AS medianaCPU
    FROM sala s
    JOIN maquina m ON s.idSala = m.fkSala
    JOIN componente c ON m.idMaquina = c.fkMaquina
    JOIN captura cap ON c.idComponente = cap.fkComponente
    WHERE s.idSala = ${idSala}
      AND c.nome = 'CPU';
  `;
  const resultado = await database.executar(sql);
  return resultado.length > 0 ? resultado[0].medianaCPU : null;
}

// Máquina crítica (a que tem mais falhas)
async function buscarMaquinaCritica(idSala) {
  const sql = `
    SELECT m.idMaquina, COUNT(a.idAlerta) AS totalFalhas
    FROM Maquina m
    JOIN Componente c ON m.idMaquina = c.fkMaquina
    JOIN Captura cap ON c.idComponente = cap.fkComponente
    JOIN Alerta a ON a.fkCaptura = cap.idCaptura
    WHERE m.fkSala = ${idSala}
      AND c.nome = 'CPU'
    GROUP BY m.idMaquina
    ORDER BY totalFalhas DESC
    LIMIT 1;
  `;
  const resultado = await database.executar(sql);
  return resultado.length > 0 ? resultado[0] : { idMaquina: null, totalFalhas: 0 };
}

// Evolução do uso de CPU da máquina crítica
async function buscarEvolucaoCPU(idSala, idMaquina) {
  const sql = `
    SELECT cap.dtCaptura, cap.registro
    FROM Captura cap
    JOIN Componente c ON cap.fkComponente = c.idComponente
    WHERE c.fkMaquina = ${idMaquina}
      AND c.nome = 'CPU'
    ORDER BY cap.dtCaptura ASC
    LIMIT 20;
  `;
  return await database.executar(sql);
}

// Ranking de falhas por máquina da sala
async function buscarRankingPorSala(idSala) {
  const sql = `
    SELECT m.idMaquina AS maquina, COUNT(a.idAlerta) AS falhas
    FROM Maquina m
    JOIN Componente c ON m.idMaquina = c.fkMaquina
    JOIN Captura cap ON c.idComponente = cap.fkComponente
    JOIN Alerta a ON a.fkCaptura = cap.idCaptura
    WHERE m.fkSala = ${idSala}
      AND c.nome = 'CPU'
    GROUP BY m.idMaquina
    ORDER BY falhas DESC;
  `;
  return await database.executar(sql);
}

// Função principal que retorna os dados da sala
async function obterDadosSala(salaId, data) {
  const maquinaCritica = await buscarMaquinaCritica(salaId);
  const totalAlertas = await obterTotalAlertasCPU(salaId);
  const medianaCPU = await obterMedianaCPU(salaId);
  const evolucaoCPU = await buscarEvolucaoCPU(salaId, maquinaCritica.idMaquina);
  const rankingFalhas = await buscarRankingPorSala(salaId);

  return {
    sala: salaId,
    data,
    maquinaCritica: {
      nome: maquinaCritica.idMaquina ? `Máquina ${maquinaCritica.idMaquina}` : 'Nenhuma',
      falhas: maquinaCritica.totalFalhas
    },
    totalAlertas,
    medianaCPU,
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

// Últimos alertas da sala
async function obterUltimosAlertas(idSala) {
  const sql = `
    SELECT 
<<<<<<< HEAD
  p.nivel AS nivel,
  m.idMaquina AS maquina,
  DATE_FORMAT(cap.dtCaptura, '%d/%m/%Y %H:%i') AS horario,
  s.nome AS sala,
  cap.registro AS cpu
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
=======
      p.nivel AS nivel,
      m.idMaquina AS maquina,
      DATE_FORMAT(cap.dtCaptura, '%d/%m/%Y %H:%i') AS horario,
      s.nome AS sala
    FROM alerta a
    JOIN captura cap ON a.fkCaptura = cap.idCaptura
    JOIN componente c ON cap.fkComponente = c.idComponente
    JOIN maquina m ON c.fkMaquina = m.idMaquina
    JOIN sala s ON m.fkSala = s.idSala
    JOIN parametro p ON a.fkParametro = p.idParametro
    WHERE s.idSala = ${idSala}
      AND c.nome = 'CPU'
    ORDER BY cap.dtCaptura DESC
    LIMIT 10;
>>>>>>> 5aecaeecac7ba4be17146dfe256bb06297955ea7
  `;
  return await database.executar(sql);
}

module.exports = { 
  obterDadosSala, 
  obterMedianaCPU, 
  obterTotalAlertasCPU, 
  obterUltimosAlertas,
  buscarMaquinaCritica,
  buscarEvolucaoCPU,
  buscarRankingPorSala
};
