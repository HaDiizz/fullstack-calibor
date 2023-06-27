const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");
const authHandler = require('../middleware/auth')

router.post("/google-auth", authCtrl.signin);
router.post("/google-token", authCtrl.verify_token);
router.post("/google-logout", authCtrl.logout);
router.post("/auth/line-token", authHandler, authCtrl.lineToken);
router.post("/auth/line-auth", authHandler, authCtrl.lineAuth);
router.post("/auth/line-revoke", authHandler, authCtrl.lineRevoke);

module.exports = router;