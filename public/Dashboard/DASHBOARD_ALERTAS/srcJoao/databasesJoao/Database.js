var mysql = require("mysql2");

// CONFIGURAÇÃO DO BANCO MYSQL
var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    charset: "utf8mb4"
};

function executar(instrucao) {
    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        console.log("\n[ERRO] O AMBIENTE (producao OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    console.log("\n[MYSQL] Ambiente:", process.env.AMBIENTE_PROCESSO);
    console.log("[MYSQL] Executando instrução:\n", instrucao);

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);

        conexao.connect(function (erro) {
            if (erro) {
                console.error("[MYSQL] ERRO AO CONECTAR:", erro);
                reject(erro);
                return;
            }

            conexao.query("SET NAMES utf8mb4;");

            conexao.query(instrucao, function (erro, resultados) {
                conexao.end();

                if (erro) {
                    console.error("[MYSQL] ERRO NA QUERY:", erro);
                    reject(erro);
                    return;
                }

                console.log("[MYSQL] Resultados:", resultados);
                resolve(resultados);
            });

            conexao.on("error", function (erro) {
                console.error("[MYSQL] ERRO NA CONEXÃO:", erro.sqlMessage || erro);
            });
        });
    });
}

function executarComParametros(instrucao, params) {
    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        console.log("\n[ERRO] O AMBIENTE (producao OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    console.log("\n[MYSQL] Ambiente:", process.env.AMBIENTE_PROCESSO);
    console.log("[MYSQL] Executando instrução com parâmetros:\n", instrucao);
    console.log("[MYSQL] Parâmetros:", params);

    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);

        conexao.connect(function (erro) {
            if (erro) {
                console.error("[MYSQL] ERRO AO CONECTAR:", erro);
                reject(erro);
                return;
            }

            conexao.query("SET NAMES utf8mb4;");

            conexao.query(instrucao, params, function (erro, resultados) {
                conexao.end();

                if (erro) {
                    console.error("[MYSQL] ERRO NA QUERY (COM PARAMETROS):", erro);
                    reject(erro);
                    return;
                }

                console.log("[MYSQL] Resultados:", resultados);
                resolve(resultados);
            });

            conexao.on("error", function (erro) {
                console.error("[MYSQL] ERRO NA CONEXÃO:", erro.sqlMessage || erro);
            });
        });
    });
}

module.exports = {
    executar,
    executarComParametros
};