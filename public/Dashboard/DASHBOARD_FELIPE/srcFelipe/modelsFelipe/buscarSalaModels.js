
const database = require('../databasesFelipe/config'); 

function listar() {
    console.log("Executando instrução SQL: listar salas");
    
    const instrucaoSql = `
       SELECT idSala AS idSala, nome AS nomeSala FROM sala; 
    `;
    
    return database.executar(instrucaoSql);
}

module.exports = {
    listar
};