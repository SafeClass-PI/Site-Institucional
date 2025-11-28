// modelsFelipe/cpuMaxModel.js

const database = require('../databasesFelipe/config'); // Assumindo seu arquivo de config

function buscarMaquinaCriticaPorSala(idSala) {
    console.log("Executando instrução SQL para máquina crítica na Sala ID:", idSala);

    // Instrução SQL adaptada para receber e usar o idSala
   const instrucaoSql = `
    SELECT 
        CONCAT('Máquina ', m.idMaquina) AS maquina,
        COUNT(a.idAlerta) AS totalFalhas
    FROM Sala s
    JOIN Maquina m ON s.idSala = m.fkSala
    JOIN Componente c ON m.idMaquina = c.fkMaquina
    JOIN Captura cap ON c.idComponente = cap.fkComponente
    JOIN Parametro p ON c.idComponente = p.fkComponente
    JOIN Alerta a ON a.fkCaptura = cap.idCaptura AND a.fkParametro = p.idParametro
    WHERE 
        s.idSala = ${idSala}
        AND c.nome = 'CPU'
        AND p.nivel = 'Crítico'
        AND cap.registro BETWEEN p.minimo AND p.maximo
    GROUP BY m.idMaquina
    ORDER BY totalFalhas DESC
    LIMIT 1;
`;
    
    return database.executar(instrucaoSql); 
}

module.exports = {
    buscarMaquinaCriticaPorSala
};