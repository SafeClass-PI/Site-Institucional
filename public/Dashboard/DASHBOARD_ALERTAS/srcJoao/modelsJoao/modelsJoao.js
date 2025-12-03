var database = require("../../../../../src/databases/config.js");

function buscarTotalAlertasCriticos() {
    var instrucaoSql = `
        SELECT 
            COUNT(*) AS totalCriticos
        FROM Alerta a
        JOIN Parametro p 
            ON a.fkParametro = p.idParametro
        WHERE 
            p.nivel = 'Crítico'
            AND a.dataHora >= DATE_SUB(NOW(), INTERVAL 6 MONTH);
    `;
    console.log("Executando buscarTotalAlertasCriticos:\n", instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarTotalAlertasModerados() {
    var instrucaoSql = `
        SELECT 
            COUNT(*) AS totalModerados
        FROM Alerta a
        JOIN Parametro p 
            ON a.fkParametro = p.idParametro
        WHERE 
            p.nivel = 'Atenção'
            AND a.dataHora >= DATE_SUB(NOW(), INTERVAL 6 MONTH);
    `;
    console.log("Executando buscarTotalAlertasModerados:\n", instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarComparacaoAlertas() {
    var instrucaoSql = `
        SELECT
            SUM(CASE WHEN p.nivel = 'Crítico' THEN 1 ELSE 0 END) AS totalCriticos,
            SUM(CASE WHEN p.nivel = 'Atenção' THEN 1 ELSE 0 END) AS totalModerados
        FROM Alerta a
        JOIN Parametro p 
            ON a.fkParametro = p.idParametro
        WHERE
            a.dataHora >= DATE_SUB(NOW(), INTERVAL 6 MONTH);
    `;
    console.log("Executando buscarComparacaoAlertas:\n", instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarComponenteMaisCritico() {
    var instrucaoSql = `
        SELECT 
            comp.idComponente,
            comp.nome AS nomeComponente,
            COUNT(*) AS totalAlertasCriticos
        FROM Alerta a
        JOIN Parametro p
            ON a.fkParametro = p.idParametro
        JOIN Componente comp
            ON p.fkComponente = comp.idComponente
        WHERE 
            p.nivel = 'Crítico'
            AND a.dataHora >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY 
            comp.idComponente, comp.nome
        ORDER BY 
            totalAlertasCriticos DESC
        LIMIT 1;
    `;
    console.log("Executando buscarComponenteMaisCritico:\n", instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMesMaisCritico() {
    var instrucaoSql = `
        SELECT 
            DATE_FORMAT(c.dtCaptura, '%Y-%m') AS mes,
            COUNT(a.idAlerta) AS totalAlertasCriticos
        FROM Alerta a
        JOIN Parametro p 
            ON a.fkParametro = p.idParametro
        JOIN Captura c
            ON a.fkCaptura = c.idCaptura
        WHERE 
            p.nivel = 'Crítico'
            AND c.dtCaptura >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY 
            DATE_FORMAT(c.dtCaptura, '%Y-%m')
        ORDER BY 
            totalAlertasCriticos DESC
        LIMIT 1;
    `;
    console.log("Executando buscarMesMaisCritico:\n", instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarAlertasCriticosMensais() {
    var instrucaoSql = `
        SELECT DATE_FORMAT(c.dtCaptura, '%Y-%m') AS mes,
               COUNT(a.idAlerta) AS total
        FROM Alerta a
        JOIN Parametro p ON a.fkParametro = p.idParametro
        JOIN Captura c ON a.fkCaptura = c.idCaptura
        WHERE 
            p.nivel = 'Crítico'
            AND c.dtCaptura >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(c.dtCaptura, '%Y-%m')
        ORDER BY mes;
    `;
    return database.executar(instrucaoSql);
}

function buscarAlertasModeradosMensais() {
    var instrucaoSql = `
        SELECT DATE_FORMAT(c.dtCaptura, '%Y-%m') AS mes,
               COUNT(a.idAlerta) AS total
        FROM Alerta a
        JOIN Parametro p ON a.fkParametro = p.idParametro
        JOIN Captura c ON a.fkCaptura = c.idCaptura
        WHERE 
            p.nivel = 'Atenção'
            AND c.dtCaptura >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(c.dtCaptura, '%Y-%m')
        ORDER BY mes;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarTotalAlertasCriticos,
    buscarTotalAlertasModerados,
    buscarComparacaoAlertas,
    buscarComponenteMaisCritico,
    buscarMesMaisCritico,
    buscarAlertasCriticosMensais,
    buscarAlertasModeradosMensais
};
