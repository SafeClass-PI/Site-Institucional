const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

async function gerarTextoRelatorio(dados) {
  const prompt = `
Você é um analista de TI. Gere um relatório claro e objetivo sobre a sala ${dados.sala} no dia ${dados.data}.

Métricas:
- Máquina crítica: ${dados.maquinaCritica.nome} (${dados.maquinaCritica.falhas} falhas)
- Total de alertas de CPU: ${dados.totalAlertas}
- Mediana do uso de CPU: ${dados.medianaCPU}%
- Evolução do uso da CPU: ${dados.statusEvolucao}

Instruções:
1. Resuma o estado geral (Estável/Atenção/Crítico).
2. Destaque a máquina problemática e possíveis causas.
3. Recomende ações práticas (monitoramento, manutenção, upgrade).
4. Termine com próximos passos.
  `;

  const resposta = await client.chat.completions.create({
    model: "gpt-4o-mini", 
    messages: [{ role: "user", content: prompt }],
  });

  return resposta.choices[0].message.content;
}

module.exports = { gerarTextoRelatorio };
