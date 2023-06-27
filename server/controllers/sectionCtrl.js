const Users = require('../models/userModel');
const Board = require('../models/boardModel');
const Task = require('../models/taskModel');
const Section = require('../models/sectionModel');

const sectionCtrl = {
    createSection: async (req, res) => {
        const { boardId } = req.params
        try {
            const section = await Section.create({ board: boardId })
            section._doc.tasks = []
            res.status(201).json(section)
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateSection: async (req, res) => {
        const { sectionId } = req.params
        try {
            const section = await Section.findByIdAndUpdate( sectionId, { $set: req.body })
            section._doc.tasks = []
            res.status(200).json(section)
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteSection: async (req, res) => {
        const { sectionId } = req.params
        try {
            await Task.deleteMany({ section: sectionId })
            await Section.deleteOne({ _id: sectionId })
            res.status(200).json({ msg: 'Deleted Successfully' })
        } catch (err) {
            res.status(500).json(err);
        }
    },
}

module.exports = sectionCtrl;
