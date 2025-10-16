var database = require("../../src/databases/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n function autenticar():", email, senha);

var instrucaoSql = `
  SELECT 
    u.idUsuario, 
    u.nome, 
    u.email, 
    u.senha, 
    u.status,  
    u.dtCadastro,
    tu.nome AS cargo
  FROM Usuario u
  JOIN Cargo tu ON u.fkCargo = tu.idCargo  WHERE u.email = '${email}'
`;

/* ------- PARTE BIA ---------- 
var instrucaoSql = ` SELECT u.idUsuario, u.nome, u.email, u.senha, u.status, u.senha_temporaria_expira, 
u.dtCadastro, tu.tipo AS cargo
 FROM Usuario 
 u JOIN Cargo tu ON u.fkTipo = tu.idTipo 
WHERE u.email = '${email}' `;
*/

console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql).then(listaDeUsuarios => {
        if (listaDeUsuarios.length > 0) {
            var usuario = listaDeUsuarios[0];

            if (usuario.status !== "ativo") {
                throw new Error('Aguardando liberação do gestor.');
            }

            const agora = new Date();
            const expira = usuario.senha_temporaria_expira ? new Date(usuario.senha_temporaria_expira) : null;

            if (usuario.senha === senha) {
                if (expira && agora > expira) {
                    throw new Error("Senha temporária expirada. Solicite nova recuperação.");
                }
                return usuario;
            } else {
                throw new Error('Email ou senha incorretos.');
            }
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


function cadastrarGestor(cargo_tipo, nome, email, senha, status) {
    var instrucaoSql = `INSERT INTO usuario (fkCargo, nome, email, senha, status) VALUES (${cargo_tipo}, '${nome}', '${email}', '${senha}', '${status}')`;

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
    var instrucaoSql = `
        SELECT idUsuario, nome, email, senha, senha_temporaria_expira 
        FROM usuario 
        WHERE idUsuario = ${idUsuario}
    `;

    console.log("Executando a instrução SQL para buscar por ID: \n" + instrucaoSql);
    return database.executar(instrucaoSql).then(resultado => {
        if (resultado.length > 0) {
            return resultado[0];
        } else {
            throw new Error("Usuário não encontrado.");
        }
    });
}



function buscarPorEmail(email) {
    const sql = `SELECT idUsuario, nome FROM usuario WHERE email = '${email}'`;
    return database.executar(sql).then(resultado => resultado[0] || null);
}

function atualizarSenhaTemporaria(idUsuario, novaSenha, expiraEm) {
    const expiraFormatada = expiraEm.toISOString().slice(0, 19).replace('T', ' ');
    const sql = `
        UPDATE usuario 
        SET senha = '${novaSenha}', senha_temporaria_expira = '${expiraFormatada}' 
        WHERE idUsuario = ${idUsuario}
    `;
    return database.executar(sql);
}

function atualizarSenha(idUsuario, novaSenha) {
    const sql = `
    UPDATE usuario 
    SET senha = '${novaSenha}', senha_temporaria_expira = NULL 
    WHERE idUsuario = ${idUsuario}
  `;
    return database.executar(sql);
}


// Atualização do módulo de exportação
module.exports = {
    autenticar,
    cadastrar,
    cadastrarGestor,
    buscarqtdSolicitacoes,
    buscarPendentes,
    aprovar,
    rejeitar,
    buscarPorId,
    buscarPorEmail,
    atualizarSenhaTemporaria,
    atualizarSenha
};