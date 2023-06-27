const router = require("express").Router();
const boardCtrl = require("../controllers/boardCtrl");
const authHandler = require('../middleware/auth')

router.post("/create", authHandler, boardCtrl.createBoard);

router.get("/boards", authHandler, boardCtrl.getAllBoard);
router.get("/board/:id", authHandler, boardCtrl.getOneBoard);
router.get("/favorites", authHandler, boardCtrl.getFavorites);

router.put("/board/invite", authHandler, boardCtrl.inviteUserToBoard);
router.put("/board/leave", authHandler, boardCtrl.leaveFromBoard);
router.put("/board/remove-member", authHandler, boardCtrl.removeMember);
router.put("/board", authHandler, boardCtrl.updatePosition);
router.put("/board/:id", authHandler, boardCtrl.updateBoard);
router.put("/favorite", authHandler, boardCtrl.updateFavoritePosition);

router.delete("/board/:id", authHandler, boardCtrl.deleteBoard);

module.exports = router;