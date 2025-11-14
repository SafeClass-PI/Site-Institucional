var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/qtdMaquinasLigadas", function (req, res) {
    dashboardController.qtdMaquinasLigadas(req, res);
});

router.get("/qtdAlertas", function (req, res) {
    dashboardController.qtdAlertas(req, res);
});

router.get("/listarSalas", function (req, res) {
    dashboardController.listarSalas(req, res);
});

router.get("/mostrarMaquinas", function (req, res) {
    dashboardController.mostrarMaquinas(req, res);
});


module.exports = router;