const { Router } = require("express");
const router = Router();

const {
  estadisticasDirectores,
  estadisticasGeneros,
} = require("../controllers/peliculasController");

router.get("/directores", estadisticasDirectores);
router.get("/generos", estadisticasGeneros);

module.exports = router;
