const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const authHandler = require('../middleware/auth')

router.get("/:boardId/search", authHandler, userCtrl.getUsersBySearch);

module.exports = router;