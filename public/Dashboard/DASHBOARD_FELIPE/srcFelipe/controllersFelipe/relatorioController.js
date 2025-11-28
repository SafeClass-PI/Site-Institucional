const SalaModel = require('../modelsFelipe/salaModel');
const IaService = require('../services/IaService');
const PdfService = require('../services/PdfService');

async function gerarRelatorioPDF(req, res) {
  try {
    const { sala } = req.query;
    const agora = new Date();
    const data = agora.toLocaleDateString('pt-BR');

    const dados = await SalaModel.obterDadosSala(sala, data);
    const textoIA = await IaService.gerarTextoRelatorio(dados);
    const pdfBuffer = await PdfService.gerarPDFBuffer(textoIA, dados);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Relatorio_CPU-SALA-${sala}_${data}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao gerar relatório');
  }
}

module.exports = { gerarRelatorioPDF };
