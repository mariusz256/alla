const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");

router.get("/", calendarController.get);
router.get("/working-hours", calendarController.getWorkingHours);
router.get("/day", calendarController.getDay);
router.post("/create", calendarController.createVisit);

module.exports = router;
