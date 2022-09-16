/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
    return knex.schema.createTable('mensajes', table => {
        table.increments('id').primary().notNullable();
        table.string('email', 255).notNullable();
        table.string('message', 255).notNullable();
        table.datetime('date').notNullable();

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

    return knex.schema.dropTable('mensajes');
};
