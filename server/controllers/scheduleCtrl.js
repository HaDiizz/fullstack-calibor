const Users = require("../models/userModel");
const ScheduleGroup = require("../models/scheduleGroupModel");
const Schedule = require("../models/scheduleModel");
const Topic = require("../models/topicModel");
const cloudinary = require("../helpers/cloudinary");
const { v4: uuidv4 } = require("uuid");

const newId = uuidv4();

const scheduleCtrl = {
  createScheduleGroup: async (req, res) => {
    const { image, name, description, link } = req.body.data;
    try {
      const result = await cloudinary.uploader.upload(image, {
        public_id: `groupImages/${newId}`,
      });
      const group = await ScheduleGroup.create({
        user: req.user._id,
        image: result.url,
        name,
        description: description === "" ? "No description..." : description,
        code: newId,
        link,
      });
      res.status(201).json(group);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getScheduleGroups: async (req, res) => {
    try {
      const schedule = await ScheduleGroup.find({
        $or: [{ members: { $in: [req.user._id] } }, { user: req.user._id }],
      }).populate("members", "name avatar email");
      res.status(200).json({
        status: "Successfully",
        data: schedule,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getScheduleGroup: async (req, res) => {
    const { groupId } = req.params;
    try {
      const group = await ScheduleGroup.findOne({
        _id: groupId,
        $or: [{ members: req.user._id }, { user: req.user._id }],
      }).populate("members", "name avatar email");
      // if (!group) return res.status(400).json({ msg: "Group not found." });
      res.status(200).json({
        status: "Successfully",
        data: group,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createSchedule: async (req, res) => {
    const { title, startDate, endDate, color, groupId, allDay } = req.body;
    try {
      const schedule = await Schedule.create({
        group: groupId,
        author: req.user._id,
        title,
        start: startDate,
        end: endDate,
        color,
        allDay,
      });
      res.status(201).json(schedule);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteSchedule: async (req, res) => {
    const { id } = req.params;
    try {
      const schedule = await Schedule.findById(id);
      if (!schedule)
        return res.status(400).json({ msg: "Schedule event does not exit" });
      if (schedule.author.toString() === req.user._id.toString()) {
        await Schedule.findByIdAndDelete(id);
        return res.status(200).json({ msg: "Schedule deleted" });
      } else {
        return res
          .status(401)
          .json({ msg: "You are not authorized to delete this event" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateSchedule: async (req, res) => {
    const { start, end, allDay } = req.body;
    const { id } = req.params;
    try {
      const schedule = await Schedule.findById(id);
      if (!schedule)
        return res.status(400).json({ msg: "Schedule event does not exit" });
      if (schedule.author.toString() === req.user._id.toString()) {
        const event = await Schedule.findOneAndUpdate(
          { _id: id },
          { start, end, allDay }
        );
        res.status(200).json(event);
      } else {
        return res
          .status(401)
          .json({ msg: "You are not authorized to update this event" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getScheduleEvent: async (req, res) => {
    const { groupId } = req.params;
    try {
      const schedule = await ScheduleGroup.findOne({
        _id: groupId,
        $or: [{ members: req.user._id }, { user: req.user._id }],
      });
      if (!schedule) return;
      const scheduleEvents = await Schedule.find({
        group: schedule._id,
      }).populate("author", "name avatar");
      res.status(200).json({
        status: "Successfully",
        data: scheduleEvents,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createTopicEvent: async (req, res) => {
    const { name, color, groupId } = req.body;
    try {
      const topic = await Topic.create({ group: groupId, name, color });
      res.status(201).json(topic);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllTopicEvents: async (req, res) => {
    try {
      const { groupId } = req.params;
      const topics = await Topic.find({ group: groupId });
      res.status(200).json(topics);
    } catch (err) {
      res.status(500).json();
    }
  },
  deleteTopicEvent: async (req, res) => {
    const { topicId } = req.params;
    try {
      await Topic.findOneAndDelete({ _id: topicId });
      res.status(200).json("Deleted Successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  currentMonth: async (req, res) => {
    try {
      const { groupId } = req.body;
      const m = parseInt(req.body.formatMonth);
      const currentMonth = await Schedule.find({
        group: groupId,
        $expr: {
          $eq: [
            {
              $month: "$start",
            },
            m,
          ],
        },
      })
        .sort({ start: -1 })
        .populate("author", "username avatar");
      res.status(200).json(currentMonth);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getGroupSearch: async (req, res) => {
    try {
      const group = await ScheduleGroup.find({
        $and: [
          { code: { $regex: req.query.code } },
          { members: { $nin: [req.user._id] } },
          { user: { $ne: req.user._id } },
        ],
      });

      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      res.status(200).json({ group });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  joinGroup: async (req, res) => {
    try {
      const { groupId, id } = req.body.data;
      const group = await ScheduleGroup.findById(groupId);
      if (group.user.toString() === id.toString())
        return res.status(400).json({ msg: "You are already in the group." });
      const isMember = group.members.includes(id);
      if (isMember)
        return res
          .status(409)
          .json({ message: "User is already in the group" });
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      group.members.push(id);
      await group.save();
      res.status(200).json();
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateImageGroup: async (req, res) => {
    const { groupId } = req.params;
    const { image, code } = req.body;

    try {
      const group = await ScheduleGroup.findOne({
        _id: groupId,
        user: req.user._id,
      });

      if (!group) return res.status(400).json({ msg: "Group does not exist" });

      const previousImage = group.image;
      if (previousImage) {
        await cloudinary.uploader.destroy(code);
      }

      const uploadedImage = await cloudinary.uploader.upload(image, {
        public_id: `groupImages/${code}`,
      });

      group.image = uploadedImage.url;
      await group.save();

      res.status(200).json();
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateGroupDetail: async (req, res) => {
    const { groupId } = req.params;
    const { name, description } = req.body;
    try {
      if (name === "") req.body.name = "Untitled";
      if (description === "") req.body.description = "Add description here...";
      const group = await ScheduleGroup.findOne({
        user: req.user._id,
        _id: groupId,
      });
      if (!group) return res.status(404).json({ msg: "Group not found" });

      const updateGroup = await ScheduleGroup.findByIdAndUpdate(groupId, {
        $set: req.body,
      });
      res.status(200).json(updateGroup);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  leaveGroup: async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    try {
      const group = await ScheduleGroup.findById(groupId);
      if (!group) return res.status(404).json({ msg: "Group not found" });
      if (group.user.toString() === userId.toString()) {
        return res
          .status(400)
          .json({ message: "You are the owner of the group." });
      }
      const index = group.members.indexOf(userId);
      if (index === -1) {
        return res
          .status(409)
          .json({ message: "User is not a members in the group" });
      }

      group.members.splice(index, 1);
      await group.save();
      res.status(200).json({ msg: "Left the group." });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteGroup: async (req, res) => {
    const { groupId } = req.params;
    try {
      const group = await ScheduleGroup.findById(groupId);
      if (group.user.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: "Access denied." });
      }
      await Topic.deleteMany({ group: groupId });
      await Schedule.deleteMany({ group: groupId });
      const previousImage = group.image;
      if (previousImage) {
        await cloudinary.uploader.destroy(group.code);
      }
      await ScheduleGroup.deleteOne({ _id: groupId });

      res.status(200).json({ msg: "Deleted the group" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  removeFromGroup: async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    try {
      const group = await ScheduleGroup.findById(groupId);
      if (!group) return res.status(404).json({ msg: "Group not found" });
      if (group.user.toString() === userId.toString()) {
        return res
          .status(400)
          .json({ message: "You are the owner of the group." });
      }
      if (group.user.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: "Access denied." });
      }
      const index = group.members.indexOf(userId);
      if (index === -1) {
        return res
          .status(409)
          .json({ message: "User is not a members in the group" });
      }

      group.members.splice(index, 1);
      await group.save();
      res.status(200).json({ msg: "Left the group." });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = scheduleCtrl;
