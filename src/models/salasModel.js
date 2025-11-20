var database = require("../databases/config")

function listar() {
    console.log("ACESSEI O SALAS MODEL \n function listar():");

    var instrucaoSql = `
        SELECT idSala, nome
        FROM sala
        ORDER BY idSala ASC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}

module.exports = {
    listar
};
