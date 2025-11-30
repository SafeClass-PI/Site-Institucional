const database = require('../databasesFelipe/config');

async function buscarMaquinasPorSala(idSala) {
  const instrucao = `
    SELECT idMaquina
    FROM Maquina
    WHERE fkSala = ?
    ORDER BY idMaquina 
  `;
  return database.executarComParametros(instrucao, [idSala]);
}

async function buscarMaquinaCritica(idSala) {
  const instrucao = `
    SELECT TOP 1 idMaquina, nomeMaquina AS maquina, COUNT(*) AS totalFalhas
    FROM Falha
    JOIN Maquina ON Falha.fkMaquina = Maquina.idMaquina
    WHERE Maquina.fkSala = ?
    GROUP BY idMaquina, nomeMaquina
    ORDER BY totalFalhas DESC
  `;
  return database.executarComParametros(instrucao, [idSala]);
}

module.exports = { buscarMaquinasPorSala, buscarMaquinaCritica };
