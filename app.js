// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });
require('dotenv').config({ path: '.env.dev' });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

// ** ROTAS IMPORTADAS CORRETAMENTE **
var usuarioRouter = require("./src/routes/usuarios");
var dashboardRouter = require("./src/routes/dashboard");
var salaRoutes = require("./src/routes/salas");
var maquinasRouter = require("./src/routes/maquinas");
var alertasRouter = require("./src/routes/alertas");
var cpuMaxRoutes = require(".//public/Dashboard/DASHBOARD_CPU/srcCPU/routesCPU/cpuMaxRoutes");
const RelatorioController = require('./public/Dashboard_CPU/DASHBOARD_CPU/srcCPU/conTrollersCPU/relatorioController');
const salaFelipeRoutes = require('./public/Dashboard/DASHBOARD_/srcCPU/routesCPU/salaRoutes');
const maquinaRoutes = require('./public/Dashboard/DASHBOARD_CPU/srcCPU/routesCPU/maquinaRoutes');
const rankingRoutes = require('./public/Dashboard/DASHBOARD_CPU/srcCPU/routesCPU/rankingRoutes');

// rota de alertas do Felipe
const alertasFelipeRoutes = require('./public/Dashboard/DASHBOARD_CPU/srcCPU/routesCPU/alertasRoutes');
const cpuUsoRoutes = require('./public/Dashboard/DASHBOARD_CPU/srcCPU/routesCPU/cpuUsoRoutes')



;

// Exemplo no app.js/index.js

const salaRouter = require('./public/Dashboard/DASHBOARD_CPU/srcCPU/routesCPU/buscarSala');



// Isso define que o endpoint completo será: /salas/listar
var ryanRouter = require("./public/Dashboard/DASHBOARD_RYAN/srcRyan/routesRyan/ryan");
var biaRouter = require("./public/Dashboard/DASHBOARD_BEATRIZ/srcBeatriz/routesBeatriz/bia");
var matheusRouter = require("./public/Dashboard/DASHBOARD_MATHEUS/srcMatheus/routesMatheus/matheus");
var joaoRouter = require("./public/Dashboard/DASHBOARD_JOAO/srcJoao/routesJoao/rotasJoao");



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public",)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors());

// ** ROTAS CONFIGURADAS COM PREFIXO /api **
app.use("/api/usuarios", usuarioRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/salas", salaRoutes);
app.use("/maquinas", maquinasRouter);
app.use("/api/alertas", alertasRouter);
app.use("/api", cpuMaxRoutes)
app.use("/salas", salaRouter);
app.use("/api/ryan", ryanRouter);
app.use("/api/bia", biaRouter);
app.get('/api/relatorio/pdf', RelatorioController.gerarRelatorioPDF);
app.use('/api', salaFelipeRoutes);
app.use('/api', rankingRoutes);

app.use('/api/sala', alertasFelipeRoutes);
app.use('/api', maquinaRoutes);

app.use("/api/matheus", matheusRouter);
app.use("/api/joao", joaoRouter);
app.use('/api', cpuUsoRoutes);


// As rotas abaixo estavam comentadas no seu código original, mas são um bom exemplo de como outras rotas seriam adicionadas
// app.use("/api/avisos", avisosRouter);
// app.use("/api/medidas", medidasRouter);
// app.use("/api/aquarios", aquariosRouter);
// app.use("/api/empresas", empresasRouter);

app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####           ####      ##    ######     ##                ##  ##    ####    ######
    ##   ##  ##      ##  ##           ## ##   ####      ##    ####                 ##  ##     ##          ##
    ##   ##  ##      ##  ##           ##  ##  ##  ##      ##    ##  ##               ##  ##     ##        ##
    ## # ##  ####    #####   ######   ##  ##  ######      ##    ######   ######   ##  ##     ##      ##
    #######  ##      ##  ##           ##  ##  ##  ##      ##    ##  ##               ##  ##     ##      ##
    ### ###  ##      ##  ##           ## ##    ##  ##      ##    ##  ##                ####      ##    ##
    ##   ##  ######  #####           ####    ##  ##      ##    ##  ##                 ##    ####    ######
    \n\n\n
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
