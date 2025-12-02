var express = require("express");
var router = express.Router();
var joaoController = require("../controllersJoao/ControllerJoao");

router.get("/alertas/criticos", joaoController.buscarTotalAlertasCriticos);

router.get("/alertas/moderados", joaoController.buscarTotalAlertasModerados);

router.get("/alertas/comparacao", joaoController.buscarComparacaoAlertas);

router.get("/alertas/componente-mais-critico", joaoController.buscarComponenteMaisCritico);

router.get("/alertas/mes-mais-critico", joaoController.buscarMesMaisCritico);

router.get("/alertas/criticos-mensais", joaoController.buscarAlertasCriticosMensais);

router.get("/alertas/moderados-mensais", joaoController.buscarAlertasModeradosMensais);
module.exports = router;
