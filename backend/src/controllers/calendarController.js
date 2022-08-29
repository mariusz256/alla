const createCalendar = require("../helpers/createCalendar");
const Time = require("../helpers/timeClass");
const { insertRange } = require("../helpers/rangeCreator");
const createDay = require("../helpers/createDay");

async function get(req, res) {
  const increment = parseInt(req.body.month) ? parseInt(req.body.month) : 0;
  console.log(req.body);
  const calendar = createCalendar(increment);
  return res.json(calendar);
}

async function getWorkingHours(req, res) {
  const config = {
    default: {
      open: new Time("9:00").time(),
      close: new Time("19:00").time(),
      visitTime: 45,
      breakeHour: new Time("12:00").time(),
      breakTimeInMinute: 30,
    },
    saturday: {
      open: new Time("9:00").time(),
      close: new Time("15:00").time(),
      visitTime: 45,
      breakTimeInMinute: 30,
      breakeHour: new Time("12:00").time(),
    },
  };

  const workingHours = {
    monday: config.monday || config.default,
    tuesday: config.tuesday || config.default,
    wednesday: config.wednesday || config.default,
    thursday: config.thursday || config.default,
    friday: config.friday || config.default,
    saturday: config.saturday || config.default,
  };

  return res.json(workingHours);
}

const getDay = (req, res) => {
  console.log(req.query);

  //get from db if  exist

  // if not exist create
  // get day config
  const dayConfig = {
    open: new Time("9:00").time(),
    close: new Time("19:00").time(),
    breakeHour: new Time("12:00").time(),
    breakTimeInMinute: 30,
  };

  const day = createDay(dayConfig);

  return res.json(day);
};

const createVisit = (req, res) => {
  const visit = {
    visitTime: "10:00",
    timeInMinute: 90,
  };
  //get day from db

  const day = {
    open: "09:00",
    close: "19:00",
    visitTime: 45,
    breakeHour: "12:00",
    breakTimeInMinute: 30,
    ranges: [
      {
        start: "09:00",
        time: 180,
        endTime: "12:00",
        user: null,
        available: true,
      },
      {
        start: "12:00",
        time: 30,
        endTime: "12:30",
        user: false,
        available: false,
      },
      {
        start: "12:30",
        time: 390,
        endTime: "19:00",
        user: null,
        available: true,
      },
    ],
  };

  const rangeIndex = 0;

  const newRanges = insertRange(
    day.ranges[rangeIndex],
    visit.visitTime,
    visit.timeInMinute,
    "mariusz112"
  );

  day.ranges.splice(rangeIndex, 1, ...newRanges);

  day.ranges = res.json(day);
};

module.exports = { get, getWorkingHours, getDay, createVisit };
