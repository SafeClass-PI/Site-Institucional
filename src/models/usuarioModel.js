var database = require("../../src/databases/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n function autenticar():", email, senha);

    var instrucaoSql = `
        SELECT email, senha, status 
        FROM usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;

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

function cadastrar(cargo_tipo, nome, email, senha) {
    var status = cargo_tipo == 2 ? 'pendente' : 'ativo';

    console.log("ACESSEI O USUARIO MODEL \n function cadastrar():", cargo_tipo, nome, email, senha, status);

    var instrucaoSql = `
        INSERT INTO usuario (fkTipo, nome, email, senha, status) 
        VALUES ('${cargo_tipo}', '${nome}', '${email}', '${senha}', '${status}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar
};
