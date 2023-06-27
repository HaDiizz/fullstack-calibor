const ScheduleGroup = require("../models/scheduleGroupModel");

const member = async (req, res, next) => {
  try {
    const schedule = await ScheduleGroup.findOne({
      $or: [{ members: req.user._id }, { user: req.user._id }],
    });
    if (!schedule) {
      // return res.status(400).json({ msg: "You are not authorized to access this schedule" });
      return res.status(400).json({});
    }

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = member;
