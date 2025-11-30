const rankingModel = require('../modelsFelipe/rankingModel');

async function listarRanking(req, res) {
  const { salaId } = req.query;

  if (!salaId) {
    return res.status(400).json({ erro: 'salaId é obrigatório' });
  }

  try {
    const resultado = await rankingModel.buscarRankingPorSala(salaId);
    res.json(resultado);
  } catch (erro) {
    console.error('Erro ao buscar ranking:', erro); // ✅ log no terminal
    res.status(500).json({ erro: 'Erro interno ao buscar ranking' });
  }
}

module.exports = {
  listarRanking
};
