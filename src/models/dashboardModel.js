var database = require("../databases/config")

function qtdMaquinasLigadas() {
    var instrucaoSql = `
    SELECT 
    COUNT(DISTINCT CASE 
        WHEN ultCaptura.ultima >= NOW() - INTERVAL 2 SECOND THEN M.idMaquina
    END) AS maquinasLigadas,
    COUNT(DISTINCT M.idMaquina) AS totalMaquinas
    FROM Maquina M
    LEFT JOIN Componente C
        ON M.idMaquina = C.fkMaquina
    LEFT JOIN (
        SELECT fkComponente, MAX(dtCaptura) AS ultima
        FROM Captura
        GROUP BY fkComponente
    ) AS ultCaptura
    ON C.idComponente = ultCaptura.fkComponente;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function taxaUptimeEscola() {
    var instrucaoSql = `
    SELECT COUNT(c.idCaptura) AS totalCapturas, COUNT(a.idAlerta) AS totalAlertas,
    CONCAT(ROUND(
            (1-(COUNT(a.idAlerta) / COUNT(c.idCaptura))) * 100,1),"%")AS uptimePercentual
    FROM captura AS c
    LEFT JOIN alerta AS a
    ON a.fkCaptura = c.idCaptura
    WHERE DATE(c.dtCaptura) = CURDATE();`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function maquinaMaisCritica() {
    var instrucaoSql = `
    SELECT CONCAT("Máquina", " ", m.idMaquina) AS maquina, COUNT(a.idAlerta) AS TotalAlertas, CONCAT("Sala", " ", m.fkSala) AS localizacao, CONCAT("Mac Address:", " ", m.macaddress) AS macaddress
    FROM Maquina AS m
    JOIN Componente AS c ON c.fkMaquina = m.idMaquina
    JOIN Captura AS ca ON ca.fkComponente = c.idComponente 
    JOIN Alerta AS a ON a.fkCaptura = ca.idCaptura
    WHERE DATE(ca.dtCaptura) = CURDATE()
    GROUP BY m.idMaquina
    ORDER BY TotalAlertas DESC
    LIMIT 1;`;

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


function listarSalas() {
    var instrucaoSql = `
    WITH maquina_status AS (
    SELECT 
        m.fkSala,
        CASE 
        WHEN m.status = 'Crítico' THEN 3
        WHEN m.status = 'Atenção' THEN 2
        WHEN m.status = 'Estável' THEN 1
        END AS valorStatus
    FROM maquina AS m
    ),
    ordered AS (
    SELECT 
        fkSala,
        valorStatus,
        ROW_NUMBER() OVER (PARTITION BY fkSala ORDER BY valorStatus) AS rn,
        COUNT(*) OVER (PARTITION BY fkSala) AS total
    FROM maquina_status
    )
    SELECT 
    s.idSala,
    s.nome,
    o.total AS qtdMaquinas,
    CASE o.valorStatus
        WHEN 3 THEN 'Crítico'
        WHEN 2 THEN 'Atenção'
        WHEN 1 THEN 'Estável'
    END AS mediana
    FROM sala AS s
    JOIN ordered AS o 
    ON o.fkSala = s.idSala
    WHERE o.rn IN (
    FLOOR((o.total + 1) / 2),
    CEIL((o.total + 1) / 2)
    )
    GROUP BY s.idSala, s.nome, o.valorStatus, o.total;`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function mostrarMaquinas(idSala) {
    var instrucaoSql = `
        SELECT CONCAT('Máquina ', m.idMaquina) AS identificacao, m.status, 
        CASE 
        WHEN m.status = 'Estável' THEN 'Funcionamento regular'
        ELSE ult.mensagem 
        END AS descricao
        FROM maquina AS m
        LEFT JOIN (
        SELECT 
            co2.fkMaquina,
            a2.mensagem
        FROM alerta a2
        JOIN captura c2 ON c2.idCaptura = a2.fkCaptura
        JOIN componente co2 ON co2.idComponente = c2.fkComponente
        JOIN (
            SELECT co3.fkMaquina, MAX(c3.dtCaptura) AS ultData
            FROM alerta a3
            JOIN captura c3 ON c3.idCaptura = a3.fkCaptura
            JOIN componente co3 ON co3.idComponente = c3.fkComponente
            GROUP BY co3.fkMaquina
        ) AS sub ON sub.fkMaquina = co2.fkMaquina AND sub.ultData = c2.dtCaptura
    ) AS ult ON ult.fkMaquina = m.idMaquina
    WHERE m.fkSala = ${idSala}
    ORDER BY 
    CASE 
        WHEN m.status = 'Crítico' THEN 1
        WHEN m.status = 'Atenção' THEN 2
        WHEN m.status = 'Estável' THEN 3
        ELSE 4
    END;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarUltimosAlertas() {
    var instrucaoSql = `
       SELECT m.idMaquina AS identificacao, c.nome as comp, ROUND(ca.registro, 1) AS registro, c.formatacao, p.nivel, m.fkSala AS sala, ca.dtCaptura AS hora FROM Alerta AS a
        JOIN Captura AS ca
        ON ca.idCaptura = a.fkCaptura
        JOIN Componente AS c
        ON c.idComponente = ca.fkComponente
        JOIN Maquina AS m
        ON m.idMaquina = c.fkMaquina
        JOIN Parametro AS p
        ON p.idParametro = a.fkParametro
        WHERE DATE(ca.dtCaptura) = CURDATE()
        ORDER BY ca.dtCaptura DESC; 
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

/* --------------- MÁQUINA ESPECIFICA -------------------- */

function kpiStatusMaquina() {
    var instrucaoSql = `
        SELECT
        CASE
            WHEN MAX(
                CASE
                    WHEN ca.registro BETWEEN pcrit.minimo AND pcrit.maximo THEN 3
                    WHEN ca.registro BETWEEN pate.minimo AND pate.maximo THEN 2
                    ELSE 1
                END
            ) = 3 THEN 'Crítico'
            WHEN MAX(
                CASE
                    WHEN ca.registro BETWEEN pate.minimo AND pate.maximo THEN 2
                    ELSE 1
                END
            ) = 2 THEN 'Atenção'
            ELSE 'Estável'
        END AS estado_maquina
        FROM Componente c
        JOIN Captura ca 
        ON ca.idCaptura = (
                SELECT MAX(ca2.idCaptura)
                FROM Captura ca2
                WHERE ca2.fkComponente = c.idComponente
            )
        LEFT JOIN Parametro pcrit ON pcrit.fkComponente = c.idComponente AND pcrit.nivel = 'Crítico'
        LEFT JOIN Parametro pate ON pate.fkComponente = c.idComponente AND pate.nivel = 'Atenção'
        WHERE c.fkMaquina = 1;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function kpiUptimeMaquina() {
    var instrucaoSql = `
        SELECT COUNT(c.idCaptura) AS totalCapturas, COUNT(a.idAlerta) AS totalAlertas,
            ROUND(
                (1-(COUNT(a.idAlerta) / COUNT(c.idCaptura))) * 100,2) AS uptime
        FROM captura AS c
        LEFT JOIN alerta AS a
        ON a.fkCaptura = c.idCaptura
        JOIN componente AS co
        ON co.idComponente = c.fkComponente
        JOIN maquina AS m
        ON m.idMaquina = co.fkMaquina
        WHERE m.idMaquina = 1 AND DATE(c.dtCaptura) = CURDATE();
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function kpiTaxaMaisCritica() {
    var instrucaoSql = `
        SELECT co.nome AS componente, MAX(ROUND(ca.registro, 1)) AS registro, co.formatacao AS formatacao, DATE_FORMAT(MAX(ca.dtCaptura), '%H:%i') AS hora
        FROM Captura AS ca
        JOIN Alerta AS a ON a.fkCaptura = ca.idCaptura
        JOIN Componente AS co ON co.idComponente = ca.fkComponente
        JOIN Maquina AS m ON m.idMaquina = co.fkMaquina
        WHERE m.idMaquina = 2 AND DATE(ca.dtCaptura) = CURDATE()
        GROUP BY co.nome, co.formatacao
        LIMIT 1;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function kpiQtdAlertasMaquina() {
    var instrucaoSql = `
       SELECT COUNT(a.idAlerta) AS qtdAlerta
        FROM Alerta AS a
        JOIN Captura AS ca
        ON ca.idCaptura = a.fkCaptura
        JOIN Componente AS c
        ON c.idComponente = ca.fkComponente
        JOIN Maquina AS m
        ON m.idMaquina = c.fkMaquina
        WHERE m.idMaquina = 1 AND DATE(ca.dtCaptura) = CURDATE();
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarUltimosAlertasMaquina() {
    var instrucaoSql = `
    SELECT m.idMaquina AS identificacao, c.nome as comp, ROUND(ca.registro, 1) AS registro, c.formatacao, p.nivel, m.fkSala AS sala, ca.dtCaptura AS hora FROM Alerta AS a
    JOIN Captura AS ca
    ON ca.idCaptura = a.fkCaptura
    JOIN Componente AS c
    ON c.idComponente = ca.fkComponente
    JOIN Maquina AS m
    ON m.idMaquina = c.fkMaquina
    JOIN Parametro AS p
    ON p.idParametro = a.fkParametro
    WHERE m.idMaquina = 2 AND DATE(ca.dtCaptura) = CURDATE()
    ORDER BY ca.dtCaptura DESC; 
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function monitoramentoComponente(idComponente) {
    var instrucaoSql = `
        SELECT 
            co.nome AS componente, 
            ROUND(ca.registro, 2) AS registro, 
            TIME(dtcaptura) AS horacaptura
        FROM captura AS ca
        JOIN componente AS co
            ON co.idcomponente = ca.fkcomponente
        WHERE co.idcomponente = ${idComponente}
        ORDER BY dtcaptura DESC
        LIMIT 8;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function monitoramentoComponenteTempoReal(idComponente) {
    var instrucaoSql = `
        SELECT 
            co.nome AS componente, 
            ROUND(ca.registro, 2) AS registro, 
            TIME(dtcaptura) AS horacaptura
        FROM captura AS ca
        JOIN componente AS co
            ON co.idcomponente = ca.fkcomponente
        WHERE co.idcomponente = ${idComponente}
        ORDER BY dtcaptura DESC
        LIMIT 1;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function monitoramentoComponenteRede(idComponenteRede) {
    var instrucaoSql = `
        SELECT 
            co.nome AS componente, 
            ROUND(ca.registro, 2) AS registro, 
            TIME(dtcaptura) AS horacaptura
        FROM captura AS ca
        JOIN componente AS co
            ON co.idcomponente = ca.fkcomponente
        WHERE co.idcomponente = ${idComponenteRede}
        ORDER BY dtcaptura DESC
        LIMIT 6;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function monitoramentoComponenteRedeTempoReal(idComponenteRede) {
    var instrucaoSql = `
        SELECT 
            co.nome AS componente, 
            ROUND(ca.registro, 2) AS registro, 
            TIME(dtcaptura) AS horacaptura
        FROM captura AS ca
        JOIN componente AS co
            ON co.idcomponente = ca.fkcomponente
        WHERE co.idcomponente = ${idComponenteRede}
        ORDER BY dtcaptura DESC
        LIMIT 1;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function graficoDisponibilidade() {
    var instrucaoSql = `
        SELECT COUNT(a.idAlerta) AS totalAlertas, (COUNT(c.idCaptura) -  COUNT(a.idAlerta)) AS capturasEstaveis
        FROM captura AS c
        LEFT JOIN alerta AS a
        ON a.fkCaptura = c.idCaptura
        JOIN componente AS co
        ON co.idComponente = c.fkComponente
        JOIN maquina AS m
        ON m.idMaquina = co.fkMaquina
        WHERE m.idMaquina = 1 AND DATE(c.dtCaptura) = CURDATE();
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function graficoFalhasPorComponente() {
    var instrucaoSql = `
        SELECT c.nome AS componente, COUNT(a.idAlerta) AS quantidade 
        FROM Alerta AS a
        RIGHT JOIN Captura AS ca
        ON a.fkCaptura = ca.idCaptura
        JOIN Componente AS c
        ON c.idComponente = ca.fkComponente
        JOIN maquina AS m
        ON m.idMaquina = c.fkMaquina
        WHERE m.idMaquina = 1 AND DATE(ca.dtCaptura) = CURDATE() AND c.nome NOT LIKE 'Upload' AND c.nome NOT LIKE 'Download'
        GROUP BY c.nome;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    qtdMaquinasLigadas,
    taxaUptimeEscola,
    maquinaMaisCritica,
    qtdAlertas,
    listarSalas,
    mostrarMaquinas,
    listarUltimosAlertas,
    kpiStatusMaquina,
    kpiUptimeMaquina,
    kpiTaxaMaisCritica,
    kpiQtdAlertasMaquina,
    listarUltimosAlertasMaquina,
    monitoramentoComponente,
    monitoramentoComponenteTempoReal,
    monitoramentoComponenteRede,
    monitoramentoComponenteRedeTempoReal,
    graficoDisponibilidade,
    graficoFalhasPorComponente
};