var database = require("../databases/config")

function qtdMaquinasLigadas() {
    var instrucaoSql = `
    SELECT SUM(CASE WHEN estado = 'Ligada' THEN 1 ELSE 0 END) AS maquinasLigadas,
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
    WHERE m.fkSala = ${idSala};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    qtdMaquinasLigadas,
    qtdAlertas,
    listarSalas,
    mostrarMaquinas
};