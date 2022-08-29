// Update with your config settings.
require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      filename: process.env.DB_FILE_NAME,
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/migrations",
    },
  },
};
