const db = require('../databasesCPU/config');

module.exports = {
  async getCapturasCpu(maquinaId, salaId) {
    const rows = await db.executarComParametros(`
      SELECT c.dtCaptura, c.registro
      FROM captura c
      JOIN componente comp ON c.fkComponente = comp.idComponente
      JOIN maquina m ON comp.fkMaquina = m.idMaquina
      WHERE m.idMaquina = ? AND m.fkSala = ? AND comp.nome = 'CPU'
      ORDER BY c.dtCaptura ASC
    `, [maquinaId, salaId]);

    return rows;
  }
};
