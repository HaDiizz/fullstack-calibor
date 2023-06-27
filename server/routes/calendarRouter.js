const router = require("express").Router();
const calendarCtrl = require("../controllers/calendarCtrl");
const authHandler = require('../middleware/auth')

router.get("/calendar", authHandler, calendarCtrl.getEventsCalendar);
router.post("/calendar", authHandler, calendarCtrl.createCalendar);
router.put("/calendar/:id", authHandler, calendarCtrl.updateCalendar);
router.delete("/calendar/:id", authHandler, calendarCtrl.deleteCalendar);

router.post("/calendar/current", authHandler, calendarCtrl.currentMonth);
router.get("/calendar/current-date", authHandler, calendarCtrl.getCurrentDate);

router.get("/calendar/events", authHandler, calendarCtrl.getAllEvents);
router.post("/calendar/event", authHandler, calendarCtrl.createEvent);
router.delete("/calendar/event/:eventId", authHandler, calendarCtrl.deleteEvent);

router.get("/schedule", calendarCtrl.getSchedule);

module.exports = router;