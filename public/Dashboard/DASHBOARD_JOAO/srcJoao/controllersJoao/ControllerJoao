var joaoModel = require("../modelsJoao/modelsJoao");

function buscarTotalAlertasCriticos(req, res) {
    joaoModel.buscarTotalAlertasCriticos()
        .then(resultado => {
            console.log("Resultado bruto - buscarTotalAlertasCriticos:", resultado);

            const linha = resultado[0] || { totalCriticos: 0 };
            console.log("Linha enviada para o front (criticos):", linha);

            res.status(200).json(linha);
        })
        .catch(erro => {
            console.error("Erro ao buscar total de alertas críticos:", erro);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

function buscarTotalAlertasModerados(req, res) {
    joaoModel.buscarTotalAlertasModerados()
        .then(resultado => {
            console.log("Resultado bruto - buscarTotalAlertasModerados:", resultado);

            const linha = resultado[0] || { totalModerados: 0 };
            console.log("Linha enviada para o front (moderados):", linha);

            res.status(200).json(linha);
        })
        .catch(erro => {
            console.error("Erro ao buscar total de alertas moderados:", erro);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

function buscarComparacaoAlertas(req, res) {
    joaoModel.buscarComparacaoAlertas()
        .then(resultado => {
            console.log("Resultado bruto - buscarComparacaoAlertas:", resultado);

            const linha = resultado[0] || { totalCriticos: 0, totalModerados: 0 };
            console.log("Linha enviada para o front (comparacao):", linha);

            res.status(200).json(linha);
        })
        .catch(erro => {
            console.error("Erro ao buscar comparação de alertas:", erro);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

function buscarComponenteMaisCritico(req, res) {
    joaoModel.buscarComponenteMaisCritico()
        .then(resultado => {
            console.log("Resultado bruto - buscarComponenteMaisCritico:", resultado);

            if (resultado.length === 0) {
                const vazio = {
                    idComponente: null,
                    nomeComponente: null,
                    totalAlertasCriticos: 0
                };
                console.log("Nenhum componente crítico encontrado, enviando:", vazio);
                return res.status(200).json(vazio);
            }

            console.log("Linha enviada para o front (componente mais crítico):", resultado[0]);
            res.status(200).json(resultado[0]);
        })
        .catch(erro => {
            console.error("Erro ao buscar componente mais crítico:", erro);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

// >>> NOVO <<<
function buscarMesMaisCritico(req, res) {
    joaoModel.buscarMesMaisCritico()
        .then((resultado) => {
            console.log("Resultado bruto - buscarMesMaisCritico:", resultado);

            if (resultado.length > 0) {
                console.log("Linha enviada para o front (mes mais crítico):", resultado[0]);
                res.status(200).json(resultado[0]); // { mes: '2025-09', totalAlertasCriticos: 12 }
            } else {
                console.log("Nenhum mês crítico encontrado.");
                res.status(204).send(); // sem conteúdo
            }
        })
        .catch((erro) => {
            console.error("Erro ao buscar mês mais crítico:", erro);
            res.status(500).json({ erro: erro.sqlMessage || erro });
        });
}
function buscarAlertasCriticosMensais(req, res) {
    joaoModel.buscarAlertasCriticosMensais()
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json({ erro: erro.sqlMessage }));
}

function buscarAlertasModeradosMensais(req, res) {
    joaoModel.buscarAlertasModeradosMensais()
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => res.status(500).json({ erro: erro.sqlMessage }));
}

module.exports = {
    buscarTotalAlertasCriticos,
    buscarTotalAlertasModerados,
    buscarComparacaoAlertas,
    buscarComponenteMaisCritico,
    buscarMesMaisCritico ,
    buscarAlertasCriticosMensais,
    buscarAlertasModeradosMensais
};