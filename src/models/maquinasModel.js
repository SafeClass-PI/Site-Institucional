var database = require("../databases/config");

function listar() {
    console.log("ACESSEI O MAQUINAS MODEL - listar()");

    var instrucaoSql = `
        SELECT idMaquina
        FROM Maquina
        ORDER BY idMaquina ASC;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Cadastrar máquina + componentes de forma segura
async function cadastrarMaquinaComComponentes(sala, so, ip, username, senha, disco, ram, cpu) {
    // Inserir a máquina
    const instrucaoMaquina = `
        INSERT INTO maquina (fkSala, sistemaOperacional, ip, username, senha)
        VALUES (?, ?, ?, ?, ?);
    `;
    const resultadoMaquina = await database.executarComParametros(instrucaoMaquina, [sala, so, ip, username, senha]);
    
    const fkMaquina = resultadoMaquina.insertId; // pega o id da máquina recém inserida

    // Inserir componentes
    const instrucaoComponente = `
        INSERT INTO Componente (fkMaquina, nome, formatacao, capacidade)
        VALUES (?, ?, ?, ?);
    `;

    await database.executarComParametros(instrucaoComponente, [fkMaquina, "Disco Rígido", "GB", disco]);
    await database.executarComParametros(instrucaoComponente, [fkMaquina, "Memória RAM", "GB", ram]);
    await database.executarComParametros(instrucaoComponente, [fkMaquina, "Processador", "%", cpu]);

    return fkMaquina;
}

module.exports = {
    listar,
    cadastrarMaquinaComComponentes
};
