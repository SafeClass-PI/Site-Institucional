var database = require("../../../../../src/databases/config.js")

function carregarSalas() {
    var instrucaoSql = `
        SELECT idSala AS identificacao
        FROM sala;
        `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function kpiStatusRede(idSala) {
    var instrucaoSql = `
        SELECT ca.registro FROM captura AS ca
        JOIN componente AS co 
        ON ca.fkComponente = co.idComponente
        JOIN maquina AS m
        ON co.fkMaquina = m.idMaquina 
        WHERE m.fkSala = ${idSala} AND co.nome LIKE 'Ping' AND ca.dtCaptura >= NOW() - INTERVAL 30 SECOND;
     `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function kpiQtdMaquinasInstaveis(idSala) {
    var instrucaoSql = `
        	SELECT (
            SELECT COUNT(DISTINCT co.fkMaquina)
            FROM captura ca
            JOIN componente co ON co.idComponente = ca.fkComponente
            JOIN maquina AS m
            ON m.idMaquina = co.fkMaquina
            WHERE m.fkSala = ${idSala} AND co.nome = 'Ping' AND ca.registro >= 350 AND ca.dtCaptura >= NOW() - INTERVAL 30 SECOND) AS maquinasInstaveis, 
            (SELECT COUNT(idMaquina) FROM maquina
            WHERE fkSala = ${idSala}) AS totalMaquinas; 
     `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function kpiHoraMelhorAcesso(idSala) {
    var instrucaoSql = `
        	SELECT CONCAT(HOUR(c.dtCaptura), ':00') AS horaRecomendada, COUNT(*) AS capturasPositivas
            FROM captura c
            JOIN componente comp 
            ON comp.idComponente = c.fkComponente
            JOIN maquina m
            ON m.idMaquina = comp.fkMaquina
            WHERE m.fkSala = ${idSala} AND comp.nome = 'Ping'
            AND c.registro < 250
            AND c.dtCaptura >= NOW() - INTERVAL 7 DAY
            GROUP BY horaRecomendada
            ORDER BY capturasPositivas DESC
            LIMIT 1;
     `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarMaquinasEstados(idSala) {
    var instrucaoSql = `
        SELECT CONCAT('Máquina ', m.idMaquina) AS identificacao, CONCAT('Ping: ', COALESCE(ca.registro, '100'), 'ms') AS dadoPing,
        CASE
            WHEN ca.registro >= 350 THEN 'Instável'
            WHEN ca.registro >= 250 THEN 'Lento'
            WHEN ca.registro IS NULL THEN 'Estável'
        ELSE 'Estável'
        END AS estadoMaquina
        FROM maquina m
        LEFT JOIN componente c
        ON c.fkMaquina = m.idMaquina 
        AND c.nome = 'Ping'
        LEFT JOIN (
            SELECT fkComponente, registro, dtCaptura
            FROM (
                SELECT 
                    fkComponente,
                    registro,
                    dtCaptura,
                    ROW_NUMBER() OVER (
                        PARTITION BY fkComponente ORDER BY dtCaptura DESC
                    ) AS rn
                FROM captura
            ) x
            WHERE x.rn = 1
        ) ca ON ca.fkComponente = c.idComponente
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


function obterDadosGraficoPing(idSala) {
    var instrucaoSql = `
        	WITH dados AS (
            SELECT
                s.idSala,
                ca.dtCaptura,
                TIME(ca.dtCaptura) AS horaCaptura,
                ca.registro AS ping,
                ROW_NUMBER() OVER (
                    PARTITION BY s.idSala, TIME(ca.dtCaptura)
                    ORDER BY ca.registro
                ) AS rn,
                COUNT(*) OVER (
                    PARTITION BY s.idSala, TIME(ca.dtCaptura)
                ) AS total
            FROM captura ca
            JOIN componente co ON co.idcomponente = ca.fkcomponente
            JOIN maquina m ON m.idMaquina = co.fkMaquina
            JOIN sala s ON s.idSala = m.fkSala
            WHERE co.nome = 'PING'
            AND s.idSala = ${idSala}
        )
        SELECT 
            idSala,
            horaCaptura,
            ROUND(
                CASE 
                    WHEN total % 2 = 1 THEN 
                        (SELECT ping 
                        FROM dados d2 
                        WHERE d2.idSala = d1.idSala
                        AND d2.horaCaptura = d1.horaCaptura
                        AND d2.rn = (d1.total + 1) / 2)
                    ELSE 
                        (SELECT AVG(ping)
                        FROM dados d2 
                        WHERE d2.idSala = d1.idSala
                        AND d2.horaCaptura = d1.horaCaptura
                        AND d2.rn IN (d1.total / 2, d1.total / 2 + 1))
                END
            , 2) AS medianaPing
        FROM dados d1
        GROUP BY idSala, horaCaptura
        ORDER BY MAX(dtCaptura) DESC
        LIMIT 8;
     `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function obterDadosGraficoPingUltimo(idSala) {
    var instrucaoSql = `
        	WITH dados AS (
            SELECT
                s.idSala,
                ca.dtCaptura,
                TIME(ca.dtCaptura) AS horaCaptura,
                ca.registro AS ping,
                ROW_NUMBER() OVER (
                    PARTITION BY s.idSala, TIME(ca.dtCaptura)
                    ORDER BY ca.registro
                ) AS rn,
                COUNT(*) OVER (
                    PARTITION BY s.idSala, TIME(ca.dtCaptura)
                ) AS total
            FROM captura ca
            JOIN componente co ON co.idcomponente = ca.fkcomponente
            JOIN maquina m ON m.idMaquina = co.fkMaquina
            JOIN sala s ON s.idSala = m.fkSala
            WHERE co.nome = 'PING'
            AND s.idSala = ${idSala}
        )
        SELECT 
            idSala,
            horaCaptura,
            ROUND(
                CASE 
                    WHEN total % 2 = 1 THEN 
                        (SELECT ping 
                        FROM dados d2 
                        WHERE d2.idSala = d1.idSala
                        AND d2.horaCaptura = d1.horaCaptura
                        AND d2.rn = (d1.total + 1) / 2)
                    ELSE 
                        (SELECT AVG(ping)
                        FROM dados d2 
                        WHERE d2.idSala = d1.idSala
                        AND d2.horaCaptura = d1.horaCaptura
                        AND d2.rn IN (d1.total / 2, d1.total / 2 + 1))
                END
            , 2) AS medianaPing
        FROM dados d1
        GROUP BY idSala, horaCaptura
        ORDER BY MAX(dtCaptura) DESC
        LIMIT 1;
     `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function graficoSemana(idSala) {
    var instrucaoSql = `
        	SELECT 
            DAYOFWEEK(ca.dtCaptura) AS diaSemana,
            SUM(CASE WHEN ca.registro > 250 THEN 1 ELSE 0 END) AS qtdAcima250
            FROM captura ca
            JOIN componente co ON co.idcomponente = ca.fkcomponente
            JOIN maquina m ON m.idMaquina = co.fkMaquina
            WHERE co.nome LIKE 'Ping'
            AND m.fkSala = ${idSala}
            AND ca.dtCaptura >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) + 7 DAY) 
            AND ca.dtCaptura < DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)     
            AND DAYOFWEEK(ca.dtCaptura) BETWEEN 2 AND 6
            GROUP BY diaSemana
            ORDER BY diaSemana;
     `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function carregarDadosPrevisao(idSala) {
    var instrucaoSql = `
            WITH dados AS (
            SELECT
                s.idSala,
                ca.dtCaptura,
                TIME(ca.dtCaptura) AS horaCaptura,
                ca.registro AS ping,
                ROW_NUMBER() OVER (
                    PARTITION BY s.idSala, TIME(ca.dtCaptura)
                    ORDER BY ca.registro
                ) AS rn,
                COUNT(*) OVER (
                    PARTITION BY s.idSala, TIME(ca.dtCaptura)
                ) AS total
            FROM captura ca
            JOIN componente co ON co.idcomponente = ca.fkcomponente
            JOIN maquina m ON m.idMaquina = co.fkMaquina
            JOIN sala s ON s.idSala = m.fkSala
            WHERE co.nome = 'PING'
            AND s.idSala = ${idSala}
            AND DATE(ca.dtCaptura) = CURDATE() 
            )
            SELECT 
                idSala,
                horaCaptura,
                ROUND(
                    CASE 
                        WHEN total % 2 = 1 THEN 
                            (SELECT ping 
                            FROM dados d2 
                            WHERE d2.idSala = d1.idSala
                            AND d2.horaCaptura = d1.horaCaptura
                            AND d2.rn = (d1.total + 1) / 2)
                        ELSE 
                            (SELECT AVG(ping)
                            FROM dados d2 
                            WHERE d2.idSala = d1.idSala
                            AND d2.horaCaptura = d1.horaCaptura
                            AND d2.rn IN (d1.total / 2, d1.total / 2 + 1))
                    END
                , 2) AS medianaPing
            FROM dados d1
            GROUP BY idSala, horaCaptura
            ORDER BY MAX(dtCaptura) ASC;
     `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    carregarSalas,
    kpiStatusRede,
    kpiQtdMaquinasInstaveis,
    kpiHoraMelhorAcesso,
    listarMaquinasEstados,
    obterDadosGraficoPing,
    obterDadosGraficoPingUltimo,
    graficoSemana,
    carregarDadosPrevisao
}
