const SalaModel = require('../modelsFelipe/salaModel');

async function getMedianaCPU(req, res) {
  try {
    const { sala } = req.query;
    const mediana = await SalaModel.obterMedianaCPU(sala);

    // retorna só o número, sem objeto
    res.send(mediana !== null ? mediana.toString() : '');
  } catch (err) {
    console.error("Erro ao buscar mediana:", err);
    res.status(500).send('');
  }
}




async function getTotalAlertas(req, res) {
  try {
    const { sala } = req.query;
    const total = await SalaModel.obterTotalAlertasCPU(sala); // 👈 função que conta só alertas de CPU
    res.json({ totalAlertas: total }); // 👈 garante que sempre devolve esse campo
  } catch (err) {
    console.error("Erro ao buscar total de alertas:", err);
    res.status(500).json({ erro: "Erro interno" });
  }
}

async function getUltimosAlertas(req, res) {
  try {
    const { sala } = req.query;
    const resultado = await SalaModel.obterUltimosAlertas(sala);
    res.json(resultado);
  } catch (err) {
    console.error('Erro ao buscar últimos alertas:', err);
    res.status(500).json({ erro: 'Erro interno ao buscar alertas' });
  }
}



module.exports = { getMedianaCPU, getTotalAlertas, getUltimosAlertas };
