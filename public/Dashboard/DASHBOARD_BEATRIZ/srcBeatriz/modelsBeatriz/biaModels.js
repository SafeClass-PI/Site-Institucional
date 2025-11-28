var database = require("../../../../../src/databases/config.js");


function buscarQtdSolicitacoesDiarias() {
    var instrucaoSql = `
        SELECT COUNT(status) AS qtdSolicitacoesDiarias
        FROM usuario
        WHERE status LIKE 'pendente'
        AND DATE(dtCadastro) = CURDATE();
    `;
    return database.executar(instrucaoSql);
}


function marcarOnline(idUsuario) {
    var instrucaoSql = `
        UPDATE usuario
        SET online = TRUE, last_login = NOW()
        WHERE idUsuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function marcarOffline(idUsuario) {
    var instrucaoSql = `
        UPDATE usuario
        SET online = FALSE
        WHERE idUsuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}


function listarUsuariosOnline() {
    var instrucaoSql = `
        SELECT idUsuario, nome, email
        FROM usuario
        WHERE online = TRUE;
    `;
    return database.executar(instrucaoSql);
}


function totalUsuarios() {
    var instrucaoSql = `
        SELECT COUNT(*) AS qtd
        FROM usuario;
    `;
    return database.executar(instrucaoSql);
}

function registrarLogin(idUsuario) {
    var instrucaoSql = `
        INSERT INTO logins (idUsuario, dataHoraLogin)
        VALUES (${idUsuario}, NOW());
    `;
    return database.executar(instrucaoSql);
}

// KPI: horário mais acessado
function horaMaisAcessada() {
    var instrucaoSql = `
        SELECT HOUR(dataHoraLogin) AS hora, COUNT(*) AS total
        FROM logins
        GROUP BY hora
        ORDER BY total DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarQtdSolicitacoesDiarias,
    marcarOnline,
    marcarOffline,
    listarUsuariosOnline,
    totalUsuarios,
    registrarLogin,
    horaMaisAcessada
};
