const { Model } = require("objection");
const knex = require("../utils/dbConnection");

Model.knex(knex);

class WorkingHours extends Model {
  static get tableName() {
    return "working_hours";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "open", "close", "availableTime"],

      properties: {
        id: { type: "integer" },
        name: {
          type: "string",
          minLength: 3,
          maxLength: 64,
        },
        open: {
          type: "string",
          minLength: 3,
          maxLength: 5,
        },
        close: {
          type: "string",
          minLength: 3,
          maxLength: 5,
        },

        availableTime: {
          type: "integer",
          minLength: 2,
          maxLength: 5,
        },
      },
    };
  }
}

module.exports = WorkingHours;
