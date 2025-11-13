var database = require("../databases/config")

function qtdMaquinasLigadas() {
    var instrucaoSql = `
    SELECT SUM(CASE WHEN status = 'Ligada' THEN 1 ELSE 0 END) AS maquinasLigadas,
    COUNT(idMaquina) AS totalMaquinas
    FROM maquina;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function qtdAlertas() {
    var instrucaoSql = `
    SELECT COUNT(a.idAlerta) AS qtdAlertas
    FROM alerta AS a
    JOIN captura AS c ON c.idCaptura = a.fkCaptura
    WHERE DATE(c.dtCaptura) = CURDATE();`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    qtdMaquinasLigadas,
    qtdAlertas
};