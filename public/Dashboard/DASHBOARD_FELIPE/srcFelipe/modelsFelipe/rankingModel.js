const db = require('../databasesFelipe/config');

async function buscarRankingPorSala(salaId) {
  try {
    const query = `
     SELECT
    CONCAT('Máquina ', m.idMaquina) AS maquina,
    COUNT(DISTINCT a.idAlerta) AS falhas
  FROM maquina m
  JOIN componente comp
    ON comp.fkMaquina = m.idMaquina
  JOIN captura c
    ON c.fkComponente = comp.idComponente
  JOIN alerta a
    ON a.fkCaptura = c.idCaptura
  JOIN parametro p
    ON p.idParametro = a.fkParametro
  WHERE m.fkSala = ?
    AND p.nivel = 'Crítico'
    AND comp.nome = 'CPU'          
  GROUP BY m.idMaquina
  ORDER BY falhas DESC;

    `;
    const rows = await db.executarComParametros(query, [salaId]); 
    return rows;
  } catch (erro) {
    console.error('Erro no rankingModel:', erro);
    throw erro;
  }
}

module.exports = {
  buscarRankingPorSala
};
