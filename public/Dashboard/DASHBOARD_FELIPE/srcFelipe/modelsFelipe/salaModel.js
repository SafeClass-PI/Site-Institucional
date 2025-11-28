const database = require('../databasesFelipe/config'); // conexão padrão

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
async function obterDadosSala(idSala, data) {
  console.log("Executando SELECT para máquina crítica na Sala ID:", idSala);

  // Converte data recebida (ex.: "28/11/2025") para formato MySQL ("2025-11-28")
  let dataFormatada = data;
  if (data && data.includes('/')) {
    const [dia, mes, ano] = data.split('/');
    dataFormatada = `${ano}-${mes}-${dia}`;
  }

  const sqlMaquinaCritica = `
    SELECT 
        CONCAT('Máquina ', m.idMaquina) AS maquina,
        COUNT(a.idAlerta) AS totalFalhas
    FROM Sala s
    JOIN Maquina m ON s.idSala = m.fkSala
    JOIN Componente c ON m.idMaquina = c.fkMaquina
    JOIN Captura cap ON c.idComponente = cap.fkComponente
    JOIN Parametro p ON c.idComponente = p.fkComponente
    JOIN Alerta a ON a.fkCaptura = cap.idCaptura AND a.fkParametro = p.idParametro
    WHERE 
        s.idSala = ${idSala}
        AND c.nome = 'CPU'
        AND p.nivel = 'Crítico'
        AND cap.registro BETWEEN p.minimo AND p.maximo
    GROUP BY m.idMaquina
    ORDER BY totalFalhas DESC
    LIMIT 1;
  `;

  const resultado = await database.executar(sqlMaquinaCritica);

  const maquinaCritica = resultado.length > 0
    ? { nome: resultado[0].maquina, falhas: resultado[0].totalFalhas }
    : { nome: 'Nenhuma máquina encontrada com falhas', falhas: 0 };

  // Chama o SELECT da mediana
  const medianaCPU = await obterMedianaCPU(idSala);

  // Define status com base na mediana real
  let statusEvolucao = 'Estável';
  if (medianaCPU >= 75) statusEvolucao = 'Crítico';
  else if (medianaCPU >= 50) statusEvolucao = 'Atenção';

  // Busca total de alertas reais
  const totalAlertas = await obterTotalAlertasCPU(idSala);

  return {
    sala: idSala,
    data: dataFormatada,
    maquinaCritica,
    totalAlertas,
    medianaCPU,
    statusEvolucao
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
