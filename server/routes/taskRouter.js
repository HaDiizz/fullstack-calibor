const router = require("express").Router();
const taskCtrl = require("../controllers/taskCtrl");
const authHandler = require('../middleware/auth')

router.post("/task/:sectionId", authHandler, taskCtrl.createTask);
router.put("/task/:taskId", authHandler, taskCtrl.updateTask);
router.put("/task", authHandler, taskCtrl.updatePosition);
router.delete("/task/:taskId", authHandler, taskCtrl.deleteTask);


module.exports = router;