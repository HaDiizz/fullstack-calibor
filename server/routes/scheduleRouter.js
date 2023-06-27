const router = require("express").Router();
const scheduleCtrl = require("../controllers/scheduleCtrl");
const authHandler = require('../middleware/auth')
const memberHandler = require("../middleware/memberHandler");

router.put("/group/join", authHandler, scheduleCtrl.joinGroup);
router.get("/group", authHandler, scheduleCtrl.getGroupSearch);
router.put("/group/:groupId", authHandler, scheduleCtrl.updateImageGroup);
router.put("/group/detail/:groupId", authHandler, scheduleCtrl.updateGroupDetail);

router.put("/group/leave/:groupId", authHandler, scheduleCtrl.leaveGroup);
router.put("/group/remove/:groupId", authHandler, scheduleCtrl.removeFromGroup);
router.delete("/group/delete/:groupId", authHandler, scheduleCtrl.deleteGroup);

router.post("/schedule/group/create", authHandler, scheduleCtrl.createScheduleGroup);
router.get("/schedule/groups", authHandler, scheduleCtrl.getScheduleGroups);
router.get("/schedule/group/:groupId", authHandler, scheduleCtrl.getScheduleGroup);
router.post("/schedule/group", authHandler, memberHandler, scheduleCtrl.createSchedule);
router.delete("/schedule/group/:id", authHandler, memberHandler, scheduleCtrl.deleteSchedule);
router.put("/schedule/group/:id", authHandler, memberHandler, scheduleCtrl.updateSchedule);

router.get("/schedule/group/events/:groupId", authHandler, memberHandler, scheduleCtrl.getScheduleEvent);
router.post("/schedule/group/topic", authHandler, memberHandler, scheduleCtrl.createTopicEvent);
router.get("/schedule/group/topics/:groupId", authHandler, memberHandler, scheduleCtrl.getAllTopicEvents);
router.delete("/schedule/topics/:topicId", authHandler, memberHandler, scheduleCtrl.deleteTopicEvent);
router.post("/schedule/current", authHandler, memberHandler, scheduleCtrl.currentMonth);

// router.delete("/calendar/:id", authHandler, calendarCtrl.deleteCalendar);

// router.get("/calendar/current-date", authHandler, calendarCtrl.getCurrentDate);

// router.get("/calendar/events", authHandler, calendarCtrl.getAllEvents);
// router.post("/calendar/event", authHandler, calendarCtrl.createEvent);

// router.get("/schedule", calendarCtrl.getSchedule);

module.exports = router;