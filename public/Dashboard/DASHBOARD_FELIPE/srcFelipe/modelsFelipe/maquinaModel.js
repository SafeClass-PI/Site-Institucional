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

module.exports = { buscarMaquinasPorSala };
