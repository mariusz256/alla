const Time = require("../helpers/timeClass");
const WorkingHours = require("../models/workingHoursModel");

async function getWorkingHours(req, res) {
  return await WorkingHours.query()
    .then((rows) => {
      res.status(200);
      if (rows.length == 0) {
        return res.json({
          success: true,
          message: "no working hours set yet",
          schema: WorkingHours.jsonSchema,
        });
      }

      if (rows.filter((config) => config.name === "default").length == 0) {
        return res.json({
          success: true,
          message: "no default working hours set yet",
          schema: WorkingHours.jsonSchema,
        });
      }

      const workingHours = {
        monday:
          rows.filter((config) => config.name === "monday")[0] ||
          rows.filter((config) => config.name === "default")[0],
        tuesday:
          rows.filter((config) => config.name === "tuesday")[0] ||
          rows.filter((config) => config.name === "default")[0],
        wednesday:
          rows.filter((config) => config.name === "wednesday")[0] ||
          rows.filter((config) => config.name === "default")[0],
        thursday:
          rows.filter((config) => config.name === "thursday")[0] ||
          rows.filter((config) => config.name === "default")[0],
        friday:
          rows.filter((config) => config.name === "friday")[0] ||
          rows.filter((config) => config.name === "default")[0],
        saturday:
          rows.filter((config) => config.name === "saturday")[0] ||
          rows.filter((config) => config.name === "default")[0],
      };

      res.json(workingHours);
    })
    .catch((err) => {
      res.status(400);
    });
}

async function setWorkingHours(req, res) {
  const config = req.body;

  const availableTime = Time.subtract(
    new Time(config.close),
    new Time(config.open)
  ).getTimeInMinutes();

  config.availableTime = availableTime;

  return await WorkingHours.query()
    .where("name", config.name)
    .then((row) => {
      if (row.length > 0) {
        res.status(409);
        return res.json({ success: false, message: "Alredy exist" });
      }

      if (row.length == 0) {
        WorkingHours.query()
          .insert(config)
          .then((workingHours) => {
            res.status(201);
            return res.json(workingHours);
          })
          .catch((err) => {
            console.log(err);
            res.status(400);
            return res.json(err);
          });
      }
    });
}

module.exports = { getWorkingHours, setWorkingHours };
