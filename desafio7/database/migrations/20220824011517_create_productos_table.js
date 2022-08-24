/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
    return knex.schema.createTable('productos', table => {
        table.increments('id').primary().notNullable();
        table.string('title', 255).notNullable();
        table.float('price').notNullable();
        table.string('thumbnail').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
    return knex.schema.dropTable('productos');
};
