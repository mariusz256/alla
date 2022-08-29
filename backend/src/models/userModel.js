const { Model } = require("objection");
const knex = require("../utils/dbConnection");
const crypto = require("crypto");
const ConfirmationToken = require("./confirmationTokenModel.js");

Model.knex(knex);

class User extends Model {
  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);
    const token = `${this.id}.${crypto.randomBytes(24).toString("hex")}`;
    await ConfirmationToken.query(queryContext.transaction).insert({
      token: token,
      user_id: this.id,
      email: this.email,
    });
  }

  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password"],

      properties: {
        id: { type: "integer" },
        email: {
          type: "string",
          minLength: 5,
          maxLength: 64,
        },
        password: {
          type: "string",
          minLength: 5,
          maxLength: 64,
        },
      },
    };
  }
}

module.exports = User;
