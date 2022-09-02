/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("working_hours", function (table) {
    table.increments("id");
    table.string("name", 64).notNullable().unique();
    table.string("open", 5).notNullable();
    table.integer("availableTime", 4).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
