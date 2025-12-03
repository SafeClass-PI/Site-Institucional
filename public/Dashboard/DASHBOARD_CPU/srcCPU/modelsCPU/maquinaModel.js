const database = require('../databasesCPU/config');

async function buscarMaquinasPorSala(idSala) {
  const instrucao = `
    SELECT idMaquina
    FROM maquina
    WHERE fkSala = ?
    ORDER BY idMaquina 
  `;
  return database.executarComParametros(instrucao, [idSala]);
}

async function buscarMaquinaCritica(idSala) {
  const instrucao = `
    SELECT TOP 1 idMaquina, nomeMaquina AS maquina, COUNT(*) AS totalFalhas
    FROM falha
    JOIN maquina ON falha.fkMaquina = maquina.idMaquina
    WHERE maquina.fkSala = ?
    GROUP BY idMaquina, nomeMaquina
    ORDER BY totalFalhas DESC
  `;
  return database.executarComParametros(instrucao, [idSala]);
}

module.exports = { buscarMaquinasPorSala, buscarMaquinaCritica };
