const SalaModel = require('../modelsFelipe/salaModel');

// Mediana CPU
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

// Total de alertas
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

// Últimos alertas (com CPU)
async function getUltimosAlertas(req, res) {
  try {
    const { sala } = req.query;
    const resultado = await SalaModel.obterUltimosAlertas(sala);

    // 🔍 DEBUG opcional: logar no console para confirmar que CPU está vindo
    console.log('Ultimos alertas retornados:', resultado);

    // Garante que sempre devolve o campo cpu
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
