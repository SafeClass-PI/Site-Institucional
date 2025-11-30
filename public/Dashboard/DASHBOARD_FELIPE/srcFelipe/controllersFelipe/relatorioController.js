const SalaModel = require('../modelsFelipe/salaModel');
const IaService = require('../services/IaService');
const PdfService = require('../services/PdfService');

async function gerarRelatorioPDF(req, res) {
  try {
    const { sala } = req.query;

    const agora = new Date();

    // Data para consulta (formato brasileiro)
    const dataConsulta = agora.toLocaleDateString('pt-BR'); // Ex: "29/11/2025"

    // Data e hora para nome do arquivo (sem caracteres inválidos)
    const dataFormatada = agora.toISOString().slice(0, 10).replace(/-/g, '_'); // Ex: "2025_11_29"
    const horaFormatada = agora.toTimeString().slice(0, 5).replace(':', '-');  // Ex: "07-05"

    // Busca os dados da sala
    const dados = await SalaModel.obterDadosSala(sala, dataConsulta);

    // Gera o texto com IA
    const textoIA = await IaService.gerarTextoRelatorio(dados);

    // Gera o PDF com layout bonito
    const pdfBuffer = await PdfService.gerarPDFBuffer(textoIA, dados);

    // Define nome do arquivo final
    const nomeArquivo = `Relatorio_Sala_${sala}_${dataFormatada}_${horaFormatada}.pdf`;

    // Envia o PDF como download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao gerar relatório');
  }
}

module.exports = { gerarRelatorioPDF };
