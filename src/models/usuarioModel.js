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
    c.nome AS cargo
  FROM usuario u
  JOIN cargo c ON u.fkCargo = c.idCargo
  WHERE u.email = '${email}'
`;


    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    return database.executar(instrucaoSql).then(listaDeUsuarios => {
        if (listaDeUsuarios.length > 0) {
            var usuario = listaDeUsuarios[0];

            if (usuario.status !== "ativo") {
                throw new Error('Aguardando liberação do gestor.');
            }

            const agora = new Date();
            const expira = usuario.senhaTemporaria ? new Date(usuario.senhaTemporaria) : null;

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

    // Garante que dtCadastro tenha valor padrão
    var instrucaoSql = `
        INSERT INTO usuario (fkCargo, fkEscola, fkGestor, nome, email, senha, dtCadastro, status) 
        VALUES (${cargo_tipo}, 1, 1, '${nome}', '${email}', '${senha}', CURDATE(), '${status}')
    `;

    console.log("Executando INSERT de cadastro:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function cadastrarGestor(cargo_tipo, nome, email, senha, status) {
    // Se quiser, pode definir status padrão aqui também
    if (!status) status = 'ativo';

    var instrucaoSql = `
        INSERT INTO usuario (fkCargo, fkEscola, nome, email, senha, dtCadastro, status)
        VALUES (${cargo_tipo}, 1, '${nome}', '${email}', '${senha}', CURDATE(), '${status}')
    `;

    console.log("Executando a instrução SQL de cadastro de gestor: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



// ------------------------------------------------------------------
// NOVAS FUNÇÕES PARA O MODAL DE SOLICITAÇÕES
// ------------------------------------------------------------------

function buscarqtdSolicitacoes() {
    var instrucaoSql = `SELECT count(status) AS qtdSolicitacoes FROM usuario
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
        SELECT idUsuario, nome, email, fkCargo, status
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
        SET senha = '${novaSenha}', senhaTemporaria = '${expiraFormatada}' 
        WHERE idUsuario = ${idUsuario}
    `;
    return database.executar(sql);
}

function atualizarSenha(idUsuario, novaSenha) {
    const sql = `
    UPDATE usuario 
    SET senha = '${novaSenha}', senhaTemporaria = NULL 
    WHERE idUsuario = ${idUsuario}
  `;
    return database.executar(sql);
}

function buscarGestorPorUsuario(idUsuario) {
    // Seleciona o nome do gestor baseado no fkGestor do usuário
    const instrucaoSql = `
        SELECT g.nome AS nomeGestor
        FROM usuario u
        JOIN usuario g ON u.fkGestor = g.idUsuario
        WHERE u.idUsuario = ${idUsuario};
    `;

    console.log("Executando SQL para buscar gestor: \n" + instrucaoSql);

    return database.executar(instrucaoSql).then(resultado => {
        if (resultado.length > 0) {
            return resultado[0].nomeGestor;
        } else {
            return "Gestor"; // fallback se não encontrar
        }
    });
}

function buscarTodos() {
    var instrucaoSql = `
        SELECT 
            u.idUsuario,
            u.nome AS nomeUsuario,
            u.email,
            c.nome AS cargo,
            u.dtCadastro,
            UPPER(u.status) AS status
        FROM usuario AS u
        JOIN cargo AS c ON u.fkCargo = c.idCargo
        WHERE status NOT LIKE 'PENDENTE'
        ORDER BY u.dtCadastro DESC;
    `;

    console.log("Executando SQL para buscar todos os usuários:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar(idUsuario) {
    const instrucaoSql = `DELETE FROM usuario WHERE idUsuario = ${idUsuario}`;
    console.log("Executando SQL para deletar usuário:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarUsuario(idUsuario, nome, email, cargo, status) {
    const instrucaoSql = `
        UPDATE usuario
        SET nome = '${nome}',
            email = '${email}',
            fkCargo = ${cargo},
            status = '${status}'
        WHERE idUsuario = ${idUsuario};
    `;
    console.log("Executando SQL para atualizar usuário:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}







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
    atualizarSenha,
    buscarGestorPorUsuario,
    buscarTodos,
    deletar,
    atualizarUsuario
};