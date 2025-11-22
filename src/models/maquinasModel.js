var database = require("../databases/config");

function listar() {
    console.log("ACESSEI O MAQUINAS MODEL - listar()");

    var instrucaoSql = `
        SELECT idMaquina
        FROM Maquina
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
        INSERT INTO Componente (fkMaquina, nome, formatacao, capacidade)
        VALUES (?, ?, ?, ?);
    `;

    await database.executarComParametros(instrucaoComponente, [fkMaquina, "Disco Rígido", "GB", disco]);
    await database.executarComParametros(instrucaoComponente, [fkMaquina, "Memória RAM", "GB", ram]);
    await database.executarComParametros(instrucaoComponente, [fkMaquina, "Processador", "%", cpu]);

    return fkMaquina; // retorna o ID da máquina cadastrada
}
function listarMaquinas(limite = 8, offset = 0) {
    const instrucaoSql = `
        SELECT m.idMaquina AS identificacao,
               CONCAT('Máquina ', m.idMaquina) AS nome_maquina,
               m.estado AS estado,
               CONCAT('Sala ', m.fkSala) AS localizacao,
               m.sistemaOperacional AS so,
               m.ip AS ipv4,
               COALESCE(cpu.capacidade, 'Intel i5') AS cpu_capacidade,
               COALESCE(ram.capacidade, '8gb') AS ram_capacidade,
               COALESCE(disco.capacidade, '500gb') AS disco_capacidade
        FROM Maquina AS m
        LEFT JOIN Componente AS cpu
            ON cpu.fkMaquina = m.idMaquina AND cpu.nome = 'CPU'
        LEFT JOIN Componente AS ram
            ON ram.fkMaquina = m.idMaquina AND ram.nome = 'RAM'
        LEFT JOIN Componente AS disco
            ON disco.fkMaquina = m.idMaquina AND disco.nome = 'Disco'
        LIMIT ? OFFSET ?;
    `;

    return database.executarComParametros(instrucaoSql, [limite, offset]);
}

module.exports = {
    listar,
    cadastrarMaquinaComComponentes,
    listarMaquinas
};
