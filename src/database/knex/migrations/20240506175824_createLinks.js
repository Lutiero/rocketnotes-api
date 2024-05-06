exports.up = (knex) => {
  return knex.schema.createTable("links", function (table) {
    table.increments("id").primary()
    table.text("url").notNullable()
    table
      .integer("note_id")
      .references("id")
      .inTable("notes")
      .onDelete("CASCADE")
    table.timestamp("created_at").default(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable("links")
}
