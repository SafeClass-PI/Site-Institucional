const db = require('../databasesFelipe/config');

module.exports = {
  async getCapturasCpu(maquinaId, salaId) {
    const rows = await db.executarComParametros(`
      SELECT c.dtCaptura, c.registro
      FROM Captura c
      JOIN Componente comp ON c.fkComponente = comp.idComponente
      JOIN Maquina m ON comp.fkMaquina = m.idMaquina
      WHERE m.idMaquina = ? AND m.fkSala = ? AND comp.nome = 'CPU'
      ORDER BY c.dtCaptura ASC
    `, [maquinaId, salaId]);

    return rows;
  }
};
