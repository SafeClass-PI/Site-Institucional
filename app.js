require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var usuarioRouter = require("./src/routes/usuarios");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", (req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/api/usuarios", usuarioRouter);

app.listen(PORTA_APP, function () {
  console.log(`
Servidor rodando em: http://${HOST_APP}:${PORTA_APP}
Ambiente: ${process.env.AMBIENTE_PROCESSO}
`);
});
