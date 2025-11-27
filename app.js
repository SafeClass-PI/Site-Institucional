// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });

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

var ryanRouter = require("./public/Dashboard/DASHBOARD_RYAN/srcRyan/routesRyan/ryan");
var biaRouter = require("./public/Dashboard/DASHBOARD_BEATRIZ/srcBeatriz/routesBeatriz/bia");


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

app.use("/api/ryan", ryanRouter);
app.use("/api/bia", biaRouter);

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