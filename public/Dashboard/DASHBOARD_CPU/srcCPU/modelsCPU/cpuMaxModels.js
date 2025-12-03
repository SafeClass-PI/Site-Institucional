
const database = require('../databasesCPU/config');

function buscarMaquinaCriticaPorSala(idSala) {
    console.log("Executando instrução SQL para máquina crítica na Sala ID:", idSala);

   const instrucaoSql = `
    SELECT 
        CONCAT('Máquina ', m.idMaquina) AS maquina,
        COUNT(a.idAlerta) AS totalFalhas
    FROM sala s
    JOIN maquina m ON s.idSala = m.fkSala
    JOIN componente c ON m.idMaquina = c.fkMaquina
    JOIN captura cap ON c.idComponente = cap.fkComponente
    JOIN parametro p ON c.idComponente = p.fkComponente
    JOIN alerta a ON a.fkCaptura = cap.idCaptura AND a.fkParametro = p.idParametro
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