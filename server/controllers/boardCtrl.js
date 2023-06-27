const Users = require("../models/userModel");
const Board = require("../models/boardModel");
const Task = require("../models/taskModel");
const Section = require("../models/sectionModel");
const ObjectId = require("mongodb").ObjectId;

const boardCtrl = {
  createBoard: async (req, res) => {
    try {
      const { title, icon, description } = req.body;
      const boardsCount = await Board.find().count();
      const board = await Board.create({
        user: req.user._id,
        position: boardsCount > 0 ? boardsCount : 0,
        title: title || "Untitled",
        description: description || "No Description...",
        icon: icon || "📋",
      });
      res.status(201).json(board);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllBoard: async (req, res) => {
    try {
      const boards = await Board.find({
        $or: [{ user: req.user._id }, { participants: req.user._id }],
      }).sort("-position");
      res.status(200).json(boards);
    } catch (error) {
      res.status(500).json(err);
    }
  },
  updatePosition: async (req, res) => {
    const { boards } = req.body;
    try {
      for (const key in boards.reverse()) {
        const board = boards[key];
        await Board.findByIdAndUpdate(board._id, { $set: { position: key } });
      }
      res.status(200).json("Updated Successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getOneBoard: async (req, res) => {
    const { id } = req.params;
    try {
      const board = await Board.findOne({
        $or: [
          { $and: [{ user: req.user._id }, { _id: id }] },
          { $and: [{ participants: req.user._id }, { _id: id }] },
        ],
      }).populate("participants user", "name avatar email");
      if (!board) return res.status(404).json({ msg: "Board not found" });

      const sections = await Section.find({ board: id });
      for (const section of sections) {
        const tasks = await Task.find({ section: section._id })
          .populate("section user", "username avatar")
          .sort("-position");
        section._doc.tasks = tasks;
      }
      board._doc.sections = sections;
      res.status(200).json(board);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateBoard: async (req, res) => {
    const { id } = req.params;
    const { title, description, favorite } = req.body;
    try {
      if (title === "") req.body.title = "Untitled";
      if (description === "") req.body.description = "Add description here...";
      const board = await Board.findById({ user: req.user._id, _id: id });
      if (!board) return res.status(404).json({ msg: "Board not found" });

      if (favorite !== undefined && board.favorite !== favorite) {
        const favorites = await Board.find({
          user: board.user,
          favorite: true,
          _id: { $ne: id },
        }).sort("favoritePosition");
        if (favorite) {
          req.body.favoritePosition =
            favorites.length > 0 ? favorites.length : 0;
        } else {
          for (const key in favorites) {
            const element = favorites[key];
            await Board.findByIdAndUpdate(element._id, {
              $set: { favoritePosition: key },
            });
          }
        }
      }
      const updateBoard = await Board.findByIdAndUpdate(id, {
        $set: req.body,
      });
      res.status(200).json(updateBoard);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getFavorites: async (req, res) => {
    try {
      const favorites = await Board.find({
        user: req.user._id,
        favorite: true,
      }).sort("-favoritePosition");
      res.status(200).json(favorites);
    } catch (err) {}
  },
  updateFavoritePosition: async (req, res) => {
    const { boards } = req.body;
    try {
      for (const key in boards.reverse()) {
        const board = boards[key];
        await Board.findByIdAndUpdate(board._id, {
          $set: { favoritePosition: key },
        });
      }
      res.status(200).json("Updated Successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteBoard: async (req, res) => {
    const { id } = req.params;
    try {
      const sections = await Section.find({ board: id });
      for (const section of sections) {
        await Task.deleteMany({ section: section._id });
      }
      await Section.deleteMany({ board: id });

      const currentBoard = await Board.findById(id);

      if (currentBoard.favorite) {
        const favorites = await Board.find({
          user: currentBoard.user,
          favorite: true,
          _id: { $ne: id },
        }).sort("favoritePosition");

        for (const key in favorites) {
          const element = favorites[key];
          await Board.findByIdAndUpdate(element._id, {
            $set: { favoritePosition: key },
          });
        }
      }
      await Board.deleteOne({ _id: id });

      const boards = await Board.find().sort("position");
      for (const key in boards) {
        const board = boards[key];
        await Board.findByIdAndUpdate(board._id, { $set: { position: key } });
      }

      res.status(200).json("Deleted Successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  inviteUserToBoard: async (req, res) => {
    try {
      const boardId = req.body.boardId;
      const id = req.body.id;
      const board = await Board.findById(boardId);
      if (board.user.toString() === id.toString())
        return res.status(400).json({ msg: "You cannot invite yourself" });

      if (!board) return res.status(404).json({ message: "Board not found" });
      const isParticipant = board.participants.includes(id);

      if (isParticipant)
        return res
          .status(409)
          .json({ message: "User is already in the board" });
      board.participants.push(id);
      await board.save();
      res.status(200).json();
    } catch (error) {
      res.status(500).json(error);
    }
  },
  leaveFromBoard: async (req, res) => {
    try {
      const boardId = req.body.boardId;
      const userId = req.body.userId;
      const board = await Board.findById(boardId);

      if (!board) return res.status(404).json({ message: "Board not found" });

      if (board.user.toString() === userId.toString()) {
        return res
          .status(400)
          .json({ message: "Board owner cannot leave the board" });
      }

      const index = board.participants.indexOf(userId);
      if (index === -1) {
        return res
          .status(409)
          .json({ message: "User is not a participant in the board" });
      }

      board.participants.splice(index, 1);
      await board.save();
      res.status(200).json();
    } catch (error) {
      res.status(500).json(error);
    }
  },
  removeMember: async (req, res) => {
    try {
      const boardId = req.body.boardId;
      const memberId = req.body.memberId;
      const userId = req.user._id;
      const board = await Board.findById(boardId);

      if (!board) return res.status(404).json({ message: "Board not found" });

      if (board.user.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Access denied." });
      }
      if (board.user.toString() === memberId.toString()) {
        return res
          .status(400)
          .json({ message: "Board owner cannot remove yourself." });
      }

      const index = board.participants.indexOf(memberId);
      if (index === -1) {
        return res
          .status(409)
          .json({ message: "User is not a participant in the board" });
      }

      board.participants.splice(index, 1);
      await board.save();
      res.status(200).json();
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = boardCtrl;
