const Knex = require("knex");
require("dotenv").config();

const knex = Knex({
  client: process.env.DB_CLIENT,
  useNullAsDefault: true,
  connection: {
    filename: process.env.DB_FILE_NAME,
  },
});

module.exports = knex;
