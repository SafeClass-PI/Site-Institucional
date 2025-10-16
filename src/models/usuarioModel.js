var database = require("../../src/databases/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n function autenticar():", email, senha);

    var instrucaoSql = `SELECT idUsuario, email, senha, status FROM usuario WHERE email = '${email}' AND senha = '${senha}'`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql).then(listaDeUsuarios => {
        if (listaDeUsuarios.length > 0) {
            var usuario = listaDeUsuarios[0];
            // Se o usuário ainda não estiver ativo, lançamos um erro
            if (usuario.status !== "ativo") {
                throw new Error('Aguardando liberação do gestor.');
            }
            return usuario;
        } else {
            throw new Error('Email ou senha incorretos.');
        }
    });
}

// Remova as aspas simples de ${cargo_tipo} se fkTipo for INT
function cadastrar(cargo_tipo, nome, email, senha) {
    var status = cargo_tipo == 2 ? 'pendente' : 'ativo';

    // 🚨 AQUI: Remova as aspas simples em volta de ${cargo_tipo}
    var instrucaoSql = `INSERT INTO usuario (fkTipo, nome, email, senha, status) VALUES (${cargo_tipo}, '${nome}', '${email}', '${senha}', '${status}')`;

    return database.executar(instrucaoSql);
}


// ------------------------------------------------------------------
// NOVAS FUNÇÕES PARA O MODAL DE SOLICITAÇÕES
// ------------------------------------------------------------------

function buscarqtdSolicitacoes() {
    var instrucaoSql = `SELECT count(status) AS qtdSolicitacoes FROM Usuario
    WHERE status LIKE 'pendente';`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPendentes() {
    // É importante selecionar o idUsuario para que possamos aprovar/rejeitar
    var instrucaoSql = `SELECT idUsuario, nome, email, DATE_FORMAT(dtCadastro, '%d/%m/%Y') AS emissao FROM usuario WHERE status = 'pendente' ORDER BY idUsuario ASC`;


    console.log("Executando a instrução SQL para buscar pendentes: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function aprovar(idUsuario) {
    // 🚨 CORREÇÃO: Remova quebras de linha e espaços antes/depois do comando
    var instrucaoSql = `UPDATE usuario SET status = 'ativo' WHERE idUsuario = ${idUsuario}`;

    console.log("Executando a instrução SQL para aprovação: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function rejeitar(idUsuario) {
    // 🚨 CORREÇÃO: Remova quebras de linha e espaços antes/depois do comando
    var instrucaoSql = `DELETE FROM usuario WHERE idUsuario = ${idUsuario}`;

    console.log("Executando a instrução SQL para rejeição: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPorId(idUsuario) {
    var instrucaoSql = `SELECT nome, email FROM usuario WHERE idUsuario = ${idUsuario}`;

    console.log("Executando a instrução SQL para buscar por ID: \n" + instrucaoSql);
    return database.executar(instrucaoSql).then(resultado => {
        if (resultado.length > 0) {
            return resultado[0]; // Retorna o primeiro (e único) usuário encontrado
        } else {
            throw new Error("Usuário não encontrado.");
        }
    });
}



// Atualização do módulo de exportação
module.exports = {
    autenticar,
    cadastrar,
    buscarqtdSolicitacoes,
    buscarPendentes, 
    aprovar,
    rejeitar,
    buscarPorId
};