var express = require("express");
var router = express.Router();
var biaController = require("../controllersBeatriz/biaController");

router.get("/qtdSolicitacoesDiarias", biaController.buscarQtdSolicitacoesDiarias);
router.get("/usuario/online", biaController.listarUsuariosOnline); 
router.get("/totalUsuarios", biaController.totalUsuarios);
router.post("/usuario/online", biaController.marcarOnline); 
router.post("/registrarLogin", biaController.registrarLogin);
router.get("/horaMaisAcessada", biaController.buscarHoraMaisAcessada);
router.get("/usuario/maisAcessos", biaController.buscarUsuarioMaisAtivo);
router.get("/totalUsuariosPorCargo", biaController.buscarTotalUsuariosPorCargo);
router.get("/rankingUsuarios", biaController.buscarRankingUsuarios);
router.get("/ultimosAcessos", biaController.buscarUltimosAcessos);




module.exports = router;
