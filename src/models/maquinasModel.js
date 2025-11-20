var database = require("../databases/config");


function cadastrarMaquina(sala, so, ip, username, senha) {
    var instrucaoSql = `
        INSERT INTO maquina (fkSala, sistemaOperacional, ip, username, senha)
        VALUES ('${sala}', '${so}', '${ip}', '${username}', '${senha}');
    `;
    return database.executar(instrucaoSql);
}





function listar() {
    console.log("ACESSEI O MAQUINAS MODEL - listar()");

    var instrucaoSql = `
        SELECT 
            idMaquina
        FROM Maquina
        ORDER BY idMaquina ASC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql);
}






module.exports = {
    cadastrarMaquina,
    listar
};