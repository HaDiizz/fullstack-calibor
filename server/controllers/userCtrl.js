const Users = require("../models/userModel");
const Board = require("../models/boardModel");
const Task = require("../models/taskModel");
const Section = require("../models/sectionModel");

const userCtrl = {
  getUsersBySearch: async (req, res) => {
    try {
      const { boardId } = req.params;
      const board = await Board.findById(boardId);

      const users = await Users.find({
        $or: [
          { username: { $regex: req.query.username } },
          { name: { $regex: req.query.username, $options: "i" } },
          { email: { $regex: req.query.username, $options: "i" } },
        ],
      })
        .limit(10)
        .select("name email avatar");

      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }

      const existingParticipants = board.participants;
      const nonParticipantUsers = users.filter(
        (user) => !existingParticipants.includes(user._id)
      );
      res.status(200).json({ users: nonParticipantUsers });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userCtrl;
