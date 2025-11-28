// models/salaModel.js

const database = require('../databasesFelipe/config'); // Assumindo que você tem um arquivo de configuração de banco

function listar() {
    console.log("Executando instrução SQL: listar salas");
    
    // ⚠️ Adapte esta query para o nome da sua tabela e colunas (nomeSala e idSala)
    const instrucaoSql = `
       SELECT idSala AS idSala, nome AS nomeSala FROM sala; 
    `;
    
    return database.executar(instrucaoSql);
}

module.exports = {
    listar
};