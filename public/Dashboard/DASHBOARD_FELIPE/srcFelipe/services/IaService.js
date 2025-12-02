const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

async function gerarTextoRelatorio(dados) {
  const evolucaoFormatada = dados.evolucaoCPU
    .map(e => `• ${e.horario} - ${e.uso}%`)
    .join('\n');

  const rankingFormatado = dados.rankingFalhas
    .map(r => `• Máquina ${r.maquina}: ${r.falhas} falhas`)
    .join('\n');

  const prompt = `
Você é um analista de TI. Gere um relatório claro e objetivo sobre a sala ${dados.sala} no dia ${dados.data}.

Métricas:
- Máquina crítica: ${dados.maquinaCritica.nome} (${dados.maquinaCritica.falhas} falhas)
- Total de alertas de CPU: ${dados.totalAlertas}
- Mediana do uso de CPU: ${dados.medianaCPU}%
- Evolução do uso da CPU (últimos registros):
${evolucaoFormatada}
- Ranking de máquinas com mais falhas:
${rankingFormatado}

Instruções:
1. Resuma o estado geral (Estável/Atenção/Crítico).
2. Destaque a máquina problemática e possíveis causas.
3. Analise a evolução do uso da CPU e identifique padrões.
4. Comente sobre o ranking de falhas e se há outras máquinas preocupantes.
5. Recomende ações práticas (monitoramento, manutenção, upgrade).
6. Termine com próximos passos.
  `;

  const resposta = await client.chat.completions.create({
    model: "gpt-4o-mini", 
    messages: [{ role: "user", content: prompt }],
  });

  return resposta.choices[0].message.content;
}


module.exports = { gerarTextoRelatorio };
