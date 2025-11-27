var express = require("express");
var router = express.Router();

var ryanController = require("../controllersRyan/ryanController");

router.get("/kpiStatusRede", function (req, res) {
    ryanController.kpiStatusRede(req, res);
});

router.get("/kpiQtdMaquinasInstaveis", function (req, res) {
    ryanController.kpiQtdMaquinasInstaveis(req, res);
});

module.exports = router;