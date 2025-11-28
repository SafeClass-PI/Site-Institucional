var database = require("../../../../../src/databases/config");

function uptimeDowntimeSemestral() {
    var instrucaoSql = `
        SELECT DATE_FORMAT(c.dtCaptura, '%Y-%m') AS mes,
               COUNT(c.idCaptura) AS totalCapturas,
               COUNT(a.idAlerta) AS totalAlertas,
               ROUND((1 - (COUNT(a.idAlerta) / COUNT(c.idCaptura))) * 100, 2) AS uptime,
               ROUND((COUNT(a.idAlerta) / COUNT(c.idCaptura)) * 100, 2) AS downtime
        FROM Captura c
        LEFT JOIN Alerta a ON a.fkCaptura = c.idCaptura
        WHERE c.dtCaptura >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY mes
        ORDER BY mes ASC;
    `;
    return database.executar(instrucaoSql);
}

function alertasPorMesSemestral() {
    var instrucaoSql = `
        SELECT DATE_FORMAT(c.dtCaptura, '%Y-%m') AS mes,
               COUNT(a.idAlerta) AS qtdAlertas
        FROM Captura c
        JOIN Alerta a ON a.fkCaptura = c.idCaptura
        WHERE c.dtCaptura >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY mes
        ORDER BY mes ASC;
    `;
    return database.executar(instrucaoSql);
}

function salasMaisAlertasSemestral() {
    var instrucaoSql = `
        SELECT s.nome AS sala, COUNT(a.idAlerta) AS qtdAlertas
        FROM Maquina m
        JOIN Componente co ON co.fkMaquina = m.idMaquina
        JOIN Captura c ON c.fkComponente = co.idComponente
        JOIN Alerta a ON a.fkCaptura = c.idCaptura
        JOIN Sala s ON s.idSala = m.fkSala
        WHERE c.dtCaptura >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY s.idSala, s.nome
        ORDER BY qtdAlertas DESC
        LIMIT 5;
    `;
    return database.executar(instrucaoSql);
}

function kpisSemestrais() {
    var instrucaoSql = `
        SELECT
            ROUND((1 - (SUM(CASE WHEN a.idAlerta IS NULL THEN 0 ELSE 1 END) / COUNT(c.idCaptura))) * 100, 2) AS uptime,
            SUM(CASE WHEN a.idAlerta IS NULL THEN 0 ELSE 1 END) AS totalAlertas
        FROM Captura c
        LEFT JOIN Alerta a ON a.fkCaptura = c.idCaptura
        WHERE c.dtCaptura >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH);
    `;
    return database.executar(instrucaoSql);
}

function salaMaisAlertasSemestral() {
    var instrucaoSql = `
        SELECT s.nome AS sala
        FROM Maquina m
        JOIN Componente co ON co.fkMaquina = m.idMaquina
        JOIN Captura c ON c.fkComponente = co.idComponente
        JOIN Alerta a ON a.fkCaptura = c.idCaptura
        JOIN Sala s ON s.idSala = m.fkSala
        WHERE c.dtCaptura >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY s.idSala, s.nome
        ORDER BY COUNT(a.idAlerta) DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    uptimeDowntimeSemestral,
    alertasPorMesSemestral,
    salasMaisAlertasSemestral,
    kpisSemestrais,
    salaMaisAlertasSemestral
};
