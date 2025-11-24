var express = require("express");
var router = express.Router();

var alertasController = require("../controllers/alertasController");

router.get("/listarAlertas", function (req, res) {
    alertasController.listarAlertas(req, res);
});

router.get('/exportarCSV', alertasController.exportarCSV);

router.get("/qtdPaginas", function (req, res) {
    alertasController.qtdPaginas(req, res);
});


module.exports = router;