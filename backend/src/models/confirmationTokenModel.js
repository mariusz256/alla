const { Model } = require("objection");
const knex = require("../utils/dbConnection");
const transtporter = require("../utils/transporter");
const mailData = require("../utils/confirmEmail");
const User = require("./userModel");

Model.knex(knex);

class ConfirmationToken extends Model {
  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);
    const data = mailData(this.email, this.token);
    transtporter.sendMail(data, (err, info) => {
      if (err) {
        console.log(err);
      }
    });
  }

  static get tableName() {
    return "confirmation_token";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["token", "user_id", "email"],

      properties: {
        token: { type: "string" },
        user_id: {
          type: "integer",
        },
        email: { type: "string" },
      },
    };
  }
}

module.exports = ConfirmationToken;
