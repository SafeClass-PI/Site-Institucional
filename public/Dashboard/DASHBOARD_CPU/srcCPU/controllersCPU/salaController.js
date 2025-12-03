const SalaModel = require('../modelsCPU/salaModel');

async function getMedianaCPU(req, res) {
  try {
    const { sala } = req.query;
    const mediana = await SalaModel.obterMedianaCPU(sala);

    res.send(mediana !== null ? mediana.toString() : '');
  } catch (err) {
    console.error("Erro ao buscar mediana:", err);
    res.status(500).send('');
  }
}

async function getTotalAlertas(req, res) {
  try {
    const { sala } = req.query;
    const total = await SalaModel.obterTotalAlertasCPU(sala);
    res.json({ totalAlertas: total });
  } catch (err) {
    console.error("Erro ao buscar total de alertas:", err);
    res.status(500).json({ erro: "Erro interno" });
  }
}

async function getUltimosAlertas(req, res) {
  try {
    const { sala } = req.query;
    const resultado = await SalaModel.obterUltimosAlertas(sala);

    console.log('Ultimos alertas retornados:', resultado);

    const alertas = resultado.map(a => ({
      nivel: a.nivel,
      maquina: a.maquina,
      horario: a.horario,
      sala: a.sala,
      cpu: a.cpu !== undefined && a.cpu !== null ? a.cpu : null
    }));

    res.json(alertas);
  } catch (err) {
    console.error('Erro ao buscar últimos alertas:', err);
    res.status(500).json({ erro: 'Erro interno ao buscar alertas' });
  }
}

module.exports = { getMedianaCPU, getTotalAlertas, getUltimosAlertas };
