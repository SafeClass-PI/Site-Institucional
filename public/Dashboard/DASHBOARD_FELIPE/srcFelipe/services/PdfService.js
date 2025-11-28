const PDFDocument = require('pdfkit');

async function gerarPDFBuffer(texto, dados) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.fontSize(18).text('Relatório de Desempenho da Sala', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Sala: ${dados.sala}`);
    doc.text(`Data: ${dados.data}`);
    doc.text(`Máquina crítica: ${dados.maquinaCritica.nome} (${dados.maquinaCritica.falhas} falhas)`);
    doc.text(`Total de alertas: ${dados.totalAlertas}`);
    doc.text(`Mediana CPU: ${dados.medianaCPU}%`);
    doc.text(`Status: ${dados.statusEvolucao}`);
    doc.moveDown();

    doc.fontSize(14).text('Análise da IA:', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(texto);

    doc.end();
  });
}

module.exports = { gerarPDFBuffer };
