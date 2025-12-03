const SalaModel = require('../modelsCPU/salaModel');
const IaService = require('../services/IaService');
const PdfService = require('../services/PdfService');

async function gerarRelatorioPDF(req, res) {
  try {
    const { sala } = req.query;

    const agora = new Date();

    const dataConsulta = agora.toLocaleDateString('pt-BR'); 

    const dataFormatada = agora.toISOString().slice(0, 10).replace(/-/g, '_'); 
    const horaFormatada = agora.toTimeString().slice(0, 5).replace(':', '-'); 

    const dados = await SalaModel.obterDadosSala(sala, dataConsulta);

    const textoIA = await IaService.gerarTextoRelatorio(dados);

    const pdfBuffer = await PdfService.gerarPDFBuffer(textoIA, dados);

    const nomeArquivo = `Relatorio_Sala_${sala}_${dataFormatada}_${horaFormatada}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao gerar relatório');
  }
}

module.exports = { gerarRelatorioPDF };
