var database = require("../databases/config");

function listar() {
    console.log("ACESSEI O MAQUINAS MODEL - listar()");

    var instrucaoSql = `
        SELECT idMaquina
        FROM maquina
        WHERE estado NOT LIKE 'Desligada'
        ORDER BY idMaquina ASC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function cadastrarMaquinaComComponentes(sala, so, ip, username, senha, disco, ram, cpu) {
    const statusPadrao = "Ligada"; // estado padrão

    // Inserir a máquina
    const instrucaoMaquina = `
        INSERT INTO maquina (fkSala, sistemaOperacional, ip, username, senha, estado)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    // Passa todos os parâmetros, incluindo o estado
    const resultadoMaquina = await database.executarComParametros(
        instrucaoMaquina,
        [sala, so, ip, username, senha, statusPadrao]
    );

    const fkMaquina = resultadoMaquina.insertId; // pega o ID da máquina cadastrada

    // Inserir os componentes da máquina
    const instrucaoComponente = `
        INSERT INTO componente (fkMaquina, nome, formatacao, capacidade)
        VALUES (?, ?, ?, ?);
    `;

    await database.executarComParametros(instrucaoComponente, [fkMaquina, "Disco Rígido", "GB", disco]);
    await database.executarComParametros(instrucaoComponente, [fkMaquina, "Memória RAM", "GB", ram]);
    await database.executarComParametros(instrucaoComponente, [fkMaquina, "Processador", "%", cpu]);

    return fkMaquina; // retorna o ID da máquina cadastrada
}

async function listarMaquinas(pagina = 1, limite = 8, estado = null) {
    const offset = (pagina - 1) * limite;

    let instrucaoSql = `
        SELECT m.idMaquina AS identificacao,
               m.estado AS estado,
               CONCAT('Sala ', m.fkSala) AS localizacao,
               m.sistemaOperacional AS so,
               m.ip AS ipv4,
               COALESCE(cpu.capacidade, 'Intel i5') AS cpu_capacidade,
               COALESCE(ram.capacidade, '8GB') AS ram_capacidade,
               COALESCE(disco.capacidade, '500GB') AS disco_capacidade
        FROM maquina AS m
        LEFT JOIN componente AS cpu
            ON cpu.fkMaquina = m.idMaquina AND cpu.nome = 'Processador'
        LEFT JOIN componente AS ram
            ON ram.fkMaquina = m.idMaquina AND ram.nome = 'Memória RAM'
        LEFT JOIN componente AS disco
            ON disco.fkMaquina = m.idMaquina AND disco.nome = 'Disco Rígido'
    `;

    const params = [];

    if (estado) {
        instrucaoSql += " WHERE m.estado = ?";
        params.push(estado === "ligado" ? "Ligada" : "Desligada");
    }

    instrucaoSql += " LIMIT ? OFFSET ?";
    params.push(parseInt(limite), parseInt(offset));

    return database.executarComParametros(instrucaoSql, params);
}

function obterPorId(idMaquina) {
    const instrucaoSql = `
        SELECT idMaquina, fkSala, sistemaOperacional, ip, username, estado, status
        FROM maquina
        WHERE idMaquina = ?
        LIMIT 1;
    `;
    return database.executarComParametros(instrucaoSql, [idMaquina]).then(res => res[0] || null);
}

function atualizar(idMaquina, fkSala, sistemaOperacional) {
    const instrucaoSql = `
        UPDATE maquina
        SET fkSala = ?, sistemaOperacional = ?
        WHERE idMaquina = ?;
    `;
    return database.executarComParametros(instrucaoSql, [fkSala, sistemaOperacional, idMaquina]);
}

async function deletar(idMaquina) {
    const deletarComponentes = `DELETE FROM componente WHERE fkMaquina = ?`;
    const deletarMaquina = `DELETE FROM maquina WHERE idMaquina = ?`;
    await database.executarComParametros(deletarComponentes, [idMaquina]);
    return database.executarComParametros(deletarMaquina, [idMaquina]);
}



module.exports = {
    listar,
    cadastrarMaquinaComComponentes,
    listarMaquinas,
    obterPorId,
    atualizar,
    deletar
};
