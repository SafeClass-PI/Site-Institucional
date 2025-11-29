
var database = require("../databases/config")

function listarAlertas(limite = 8, offset = 0) {
    var instrucaoSql = `
   SELECT CONCAT('Máquina ', m.idMaquina) AS identificacao, CASE WHEN c.nome LIKE 'RAM' THEN 'Memória RAM' ELSE c.nome END AS componente, REPLACE(
    REPLACE( REPLACE( REPLACE(a.mensagem, ' de CPU', ''), ' de Memoria', ''),' de Disco', ''), 'a', 'em') AS mensagem, 
    p.nivel AS nivel, CONCAT('Sala ', m.fkSala) AS localizacao, DATE_FORMAT(ca.dtCaptura, '%d/%m/%Y %H:%i:%s') AS hora
    FROM maquina AS m
    JOIN componente AS c
    ON m.idMaquina = c.fkMaquina
    JOIN captura AS ca
    ON ca.fkComponente = c.idComponente
    JOIN alerta AS a
    ON a.fkCaptura = ca.idCaptura
    JOIN parametro AS p
    ON p.fkComponente = c.idComponente
    ORDER BY ca.dtCaptura DESC
    LIMIT ? OFFSET ?;
    `;
    
    return database.executarComParametros(instrucaoSql, [limite, offset]);
}

function qtdPaginas() {
    var instrucaoSql = `
        SELECT CEIL(COUNT(idAlerta) / 8) AS paginas
        FROM alerta;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    listarAlertas,
    qtdPaginas
}
