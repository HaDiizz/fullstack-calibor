const router = require("express").Router();
const rateCtrl = require("../controllers/rateCtrl");
const authHandler = require('../middleware/auth')

router.post("/rating", authHandler, rateCtrl.createRating);
router.get("/rating", authHandler, rateCtrl.getRating);

module.exports = router;