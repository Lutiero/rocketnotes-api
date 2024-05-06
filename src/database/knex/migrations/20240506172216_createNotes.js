exports.up = (knex) => {
  return knex.schema.createTable("notes", function (table) {
    table.increments("id").primary()
    table.text("title")
    table.text("description")
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")

    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable("notes")
}
