const express = require("express");
const router = express.Router();
const salasController = require("../controllers/salasController");

router.get("/listar", salasController.listar);

module.exports = router;
