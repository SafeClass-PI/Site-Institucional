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

function kpiHoraMelhorAcesso() {
    var instrucaoSql = `
        	SELECT CONCAT(HOUR(c.dtCaptura), ':00') AS horaRecomendada, COUNT(*) AS capturasPositivas
            FROM Captura c
            JOIN Componente comp 
            ON comp.idComponente = c.fkComponente
            JOIN Maquina m
            ON m.idMaquina = comp.fkMaquina
            WHERE m.fkSala = 1 AND comp.nome = 'Ping'
            AND c.registro < 250
            AND c.dtCaptura >= NOW() - INTERVAL 7 DAY
            GROUP BY horaRecomendada
            ORDER BY capturasPositivas DESC
            LIMIT 1;
     `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarMaquinasEstados() {
    var instrucaoSql = `
        	SELECT 
            CONCAT('Máquina ', m.idMaquina) AS identificacao,
            CONCAT('Ping: ', COALESCE(ca.registro, '100'), 'ms') AS dadoPing,
            CASE
                WHEN ca.registro >= 350 THEN 'Instável'
                WHEN ca.registro >= 250 THEN 'Lento'
                WHEN ca.registro IS NULL THEN 'Estável'
                ELSE 'Estável'
            END AS estadoMaquina
            FROM Maquina m
            LEFT JOIN Componente c
            ON c.fkMaquina = m.idMaquina 
            AND c.nome = 'Ping'
            LEFT JOIN (
                SELECT fkComponente, registro, dtCaptura
                FROM Captura
                WHERE dtCaptura = (
                    SELECT MAX(dtCaptura)
                    FROM Captura c2
                    WHERE c2.fkComponente = Captura.fkComponente
                )
            ) ca
            ON ca.fkComponente = c.idComponente
            WHERE m.fkSala = 1
            ORDER BY
            CASE
                WHEN ca.registro >= 350 THEN 1
                WHEN ca.registro >= 250 THEN 2
                ELSE 3
            END;
     `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    kpiStatusRede,
    kpiQtdMaquinasInstaveis,
    kpiHoraMelhorAcesso,
    listarMaquinasEstados
}
