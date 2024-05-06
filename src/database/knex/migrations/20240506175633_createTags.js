exports.up = (knex) => {
  return knex.schema.createTable("tags", function (table) {
    table.increments("id").primary()
    table.text("name").notNullable()
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table
      .integer("note_id")
      .references("id")
      .inTable("notes")
      .onDelete("CASCADE")
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable("tags")
}
