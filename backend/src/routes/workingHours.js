const express = require("express");
const router = express.Router();
const workingHoursController = require("../controllers/workingHourscController");

router.get("/", workingHoursController.getWorkingHours);
router.post("/set", workingHoursController.setWorkingHours);

module.exports = router;
