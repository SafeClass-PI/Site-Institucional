const database = require('../databasesFelipe/config'); // conexão padrão

async function obterMedianaCPU(idSala) {
  const sql = `
    SELECT sub.registro AS medianaCPU
    FROM (
        SELECT cap.registro,
               ROW_NUMBER() OVER (ORDER BY cap.registro) AS row_num,
               COUNT(*) OVER () AS total_rows
        FROM Sala s
        JOIN Maquina m ON s.idSala = m.fkSala
        JOIN Componente c ON m.idMaquina = c.fkMaquina
        JOIN Captura cap ON c.idComponente = cap.fkComponente
        WHERE s.idSala = ${idSala}
          AND c.nome = 'CPU'
    ) AS sub
    WHERE sub.row_num = FLOOR((sub.total_rows + 1) / 2);
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

  return {
    sala: idSala,
    data: dataFormatada,
    maquinaCritica,
    totalAlertas: 999, // ainda mockado, vamos desmockar depois
    medianaCPU,
    statusEvolucao
  };
}

module.exports = { obterDadosSala, obterMedianaCPU };
