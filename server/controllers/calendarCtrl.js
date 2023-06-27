const Users = require("../models/userModel");
const Calendar = require("../models/calendarModel");
const Event = require("../models/eventModel");

const calendarCtrl = {
  createCalendar: async (req, res) => {
    const { title, startDate, endDate, color } = req.body;
    try {
      const calendar = await Calendar.create({
        user: req.user._id,
        title,
        start: startDate,
        end: endDate,
        color,
      });
      res.status(201).json(calendar);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createEvent: async (req, res) => {
    const { name, color } = req.body;
    try {
      const event = await Event.create({ user: req.user._id, name, color });
      res.status(201).json(event);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.find({ user: req.user._id });
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteEvent: async (req, res) => {
    const { eventId } = req.params;
    try {
      await Event.findOneAndDelete({ _id: eventId });
      res.status(200).json("Deleted Successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getEventsCalendar: async (req, res) => {
    try {
      const calendars = await Calendar.find({ user: req.user._id });
      res.status(200).json(calendars);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  currentMonth: async (req, res) => {
    try {
      const m = parseInt(req.body.formatMonth);
      const currentMonth = await Calendar.find({
        user: req.user._id,
        $expr: {
          $eq: [
            {
              $month: "$start",
            },
            m,
          ],
        },
      }).sort({ start: -1 });
      res.status(200).json(currentMonth);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getSchedule: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ msg: "Status failed, User does not exit" });
      const schedules = await Calendar.find({ user: user._id }).select("-user");
      if (!schedules)
        return res
          .status(400)
          .json({ msg: "Status failed, Schedule does not exit" });
      res.status(200).json({
        status: "Successfully",
        data: schedules,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getCurrentDate: async (req, res) => {
    try {
      const date = new Date();
      const currentDates = await Calendar.find({
        user: req.user._id,
        $or: [
          { start: { $lte: date }, end: { $gte: date } },
          {
            start: { $lte: date.setHours(23, 59, 59, 999) },
            end: { $gte: date.setHours(23, 59, 59, 999) },
          },
        ],
      }).sort({ start: 1 });

      res.status(200).json(currentDates);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateCalendar: async (req, res) => {
    const { start, end } = req.body;
    const { id } = req.params;
    try {
      const calendarUser = await Calendar.findOne({ user: req.user._id });
      if (!calendarUser)
        return res.status(400).json({ msg: "Calendar event does not exit" });
      if (req.user._id.toString() !== calendarUser.user.toString())
        return res.status(400).json({ msg: "Authorization error" });
      const event = await Calendar.findOneAndUpdate(
        { _id: id },
        { start, end }
      );
      res.status(200).json(event);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteCalendar: async (req, res) => {
    const { id } = req.params;
    try {
      const calendarUser = await Calendar.findOne({ user: req.user._id });
      if (!calendarUser)
        return res.status(400).json({ msg: "Calendar event does not exit" });
      if (req.user._id.toString() !== calendarUser.user.toString())
        return res.status(400).json({ msg: "Authorization error" });
      await Calendar.findOneAndDelete({ _id: id });
      res.status(200).json({ msg: "Deleted Successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = calendarCtrl;
