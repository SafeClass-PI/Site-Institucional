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
    SELECT u.idUsuario, MAX(l.dataHoraLogin) AS ultimoLogin
    FROM Usuario u
    INNER JOIN logins l ON u.idUsuario = l.idUsuario
    WHERE DATE(l.dataHoraLogin) = CURDATE()
    GROUP BY u.idUsuario;
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

function horaMaisAcessada() {
    var instrucaoSql = `
       SELECT HOUR(dataHoraLogin) AS hora, COUNT(*) AS total
        FROM logins
		WHERE DATE(dataHoraLogin) = CURDATE()
        GROUP BY hora
        ORDER BY total DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function usuarioMaisAtivo() {
    var instrucaoSql = `
        SELECT u.nome, COUNT(l.idUsuario) AS totalLogins
        FROM logins l
        JOIN usuario u ON l.idUsuario = u.idUsuario
        GROUP BY l.idUsuario
        ORDER BY totalLogins DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function totalUsuariosPorCargo() {
    const instrucaoSql = `
        SELECT c.nome AS cargo, COUNT(u.idUsuario) AS totalUsuarios
        FROM Cargo c
        LEFT JOIN Usuario u ON u.fkCargo = c.idCargo
        GROUP BY c.idCargo, c.nome
        ORDER BY totalUsuarios DESC;
    `;
    return database.executar(instrucaoSql);
}

function rankingUsuarios() {
    const instrucaoSql = `
        SELECT u.nome, COUNT(l.idUsuario) AS totalLogins
        FROM usuario u
        JOIN logins l ON u.idUsuario = l.idUsuario
        WHERE DATE(l.dataHoraLogin) = CURDATE()
        GROUP BY u.idUsuario
        ORDER BY totalLogins DESC;

    `;
    return database.executar(instrucaoSql);
}

function ultimosAcessos() {
    var instrucaoSql = `
   SELECT 
    u.nome AS NomeUsuario,
    l.dataHoraLogin AS HorarioLogin,
    c.nome AS CargoUsuario
    FROM logins l
    JOIN Usuario u ON l.idUsuario = u.idUsuario
    JOIN Cargo c ON u.fkCargo = c.idCargo
    WHERE DATE(l.dataHoraLogin) = CURDATE()
    ORDER BY l.dataHoraLogin DESC;
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
    horaMaisAcessada,
    usuarioMaisAtivo,
    totalUsuariosPorCargo,
    rankingUsuarios,
    ultimosAcessos
};
