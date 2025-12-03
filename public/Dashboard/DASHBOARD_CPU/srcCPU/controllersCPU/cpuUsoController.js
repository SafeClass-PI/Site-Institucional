const { getCapturasCpu } = require('../modelsCPU/cpuUsoModel');

async function listarCapturasCpu(req, res) {
  const { maquinaId, salaId } = req.query;

  if (!maquinaId || !salaId) {
    return res.status(400).json({ erro: 'Parâmetros maquinaId e salaId são obrigatórios' });
  }

  try {
    const dados = await getCapturasCpu(maquinaId, salaId);
    res.json(dados);
  } catch (err) {
    console.error('Erro ao buscar capturas:', err);
    res.status(500).json({ erro: 'Erro interno ao buscar capturas' });
  }
}

module.exports = { listarCapturasCpu };
