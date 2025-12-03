const MaquinaModel = require('../modelsCPU/maquinaModel');

async function filtrarPorSala(req, res) {
  const { salaId } = req.query;
  if (!salaId) return res.status(400).json({ erro: 'Sala não informada' });

  try {
    const maquinas = await MaquinaModel.buscarMaquinasPorSala(salaId);

    const apenasIds = maquinas.map(m => ({ idMaquina: m.idMaquina }));
    res.json({ maquinas: apenasIds });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao buscar máquinas' });
  }
}





module.exports = { filtrarPorSala };
