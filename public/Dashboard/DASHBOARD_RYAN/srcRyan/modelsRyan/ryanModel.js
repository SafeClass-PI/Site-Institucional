var database = require("../../../../../src/databases/config.js")

function kpiStatusRede() {
    var instrucaoSql = `
        SELECT ca.registro FROM Captura AS ca
        JOIN Componente AS co 
        ON ca.fkComponente = co.idComponente
        JOIN Maquina AS m
        ON co.fkMaquina = m.idMaquina 
        WHERE m.fkSala = 1 AND co.nome LIKE 'Ping' AND ca.dtCaptura >= NOW() - INTERVAL 30 SECOND;
     `;
 
     console.log("Executando a instrução SQL: \n" + instrucaoSql);
     return database.executar(instrucaoSql);
}

function kpiQtdMaquinasInstaveis() {
    var instrucaoSql = `
        	SELECT (
            SELECT COUNT(DISTINCT co.fkMaquina)
            FROM Captura ca
            JOIN Componente co ON co.idComponente = ca.fkComponente
            JOIN Maquina AS m
            ON m.idMaquina = co.fkMaquina
            WHERE m.fkSala = 1 AND co.nome = 'Ping' AND ca.registro >= 350 AND ca.dtCaptura >= NOW() - INTERVAL 30 SECOND) AS maquinasInstaveis, 
            (SELECT COUNT(idMaquina) FROM Maquina
            WHERE fkSala = 1) AS totalMaquinas; 
     `;
 
     console.log("Executando a instrução SQL: \n" + instrucaoSql);
     return database.executar(instrucaoSql);
}

module.exports = {
    kpiStatusRede,
    kpiQtdMaquinasInstaveis
}
