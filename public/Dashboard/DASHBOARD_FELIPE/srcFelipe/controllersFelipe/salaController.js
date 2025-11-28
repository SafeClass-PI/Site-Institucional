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

module.exports = { getMedianaCPU };
