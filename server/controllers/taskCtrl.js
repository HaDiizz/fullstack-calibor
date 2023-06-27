const Users = require('../models/userModel');
const Board = require('../models/boardModel');
const Task = require('../models/taskModel');
const Section = require('../models/sectionModel');

const taskCtrl = {
  createTask: async (req, res) => {
    const { sectionId } = req.body;
    try {
      const section = await Section.findById(sectionId);
      const tasksCount = await Task.find({ section: sectionId }).count();
      const task = await Task.create({
        user: req.user._id,
        section: sectionId,
        position: tasksCount > 0 ? tasksCount : 0,
      });
      await task.populate('user', 'username avatar')
      task._doc.section = section;
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateTask: async (req, res) => {
    const { taskId } = req.params;
    try {
      const task = await Task.findByIdAndUpdate(taskId, { $set: req.body });
      res.status(200).json(task);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteTask: async (req, res) => {
    const { taskId } = req.params;
    try {
      const currentTask = await Task.findById(taskId);
      await Task.deleteOne({ _id: taskId });
      const tasks = await Task.find({ section: currentTask.section }).sort(
        'postition'
      );
      for (const key in tasks) {
        await Task.findByIdAndUpdate(tasks[key]._id, {
          $set: { position: key },
        });
      }
      res.status(200).json('Deleted Successfully');
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updatePosition: async (req, res) => {
    const {
      resourceList,
      destinationList,
      resourceSectionId,
      destinationSectionId,
    } = req.body;
    const resourceListReverse = resourceList.reverse();
    const destinationListReverse = destinationList.reverse();
    try {
      if (resourceSectionId !== destinationSectionId) {
        for (const key in resourceListReverse) {
          await Task.findByIdAndUpdate(resourceListReverse[key]._id, {
            $set: {
              section: resourceSectionId,
              position: key,
            },
          });
        }
      }
      for (const key in destinationListReverse) {
        await Task.findByIdAndUpdate(destinationListReverse[key]._id, {
          $set: {
            section: destinationSectionId,
            position: key,
          },
        });
      }
      res.status(200).json('Updated Successfully');
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = taskCtrl;
