const express = require("express");
const router = express.Router();
const matheusController = require("../controllersMatheus/matheusController");

router.get("/uptimeDowntimeSemestral", matheusController.uptimeDowntimeSemestral);
router.get("/alertasPorMesSemestral", matheusController.alertasPorMesSemestral);
router.get("/salasMaisAlertasSemestral", matheusController.salasMaisAlertasSemestral);
router.get("/kpisSemestrais", matheusController.kpisSemestrais);

module.exports = router;
