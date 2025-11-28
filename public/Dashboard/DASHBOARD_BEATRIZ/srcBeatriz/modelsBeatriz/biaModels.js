var database = require("../../../../../src/databases/config.js");

function buscarQtdSolicitacoesDiarias() {
    var instrucaoSql = `
        SELECT COUNT(status) AS qtdSolicitacoesDiarias
        FROM usuario
        WHERE status LIKE 'pendente'
        AND DATE(dtCadastro) = CURDATE();
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarQtdSolicitacoesDiarias
};
