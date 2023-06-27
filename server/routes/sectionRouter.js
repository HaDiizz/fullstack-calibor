const router = require("express").Router();
const sectionCtrl = require("../controllers/sectionCtrl");
const authHandler = require('../middleware/auth')

router.post("/section/:boardId", authHandler, sectionCtrl.createSection);
router.put("/section/:sectionId", authHandler, sectionCtrl.updateSection);
router.delete("/section/:sectionId", authHandler, sectionCtrl.deleteSection);


module.exports = router;