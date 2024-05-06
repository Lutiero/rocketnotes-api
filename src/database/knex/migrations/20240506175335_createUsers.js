exports.up = (knex) => {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary()
    table.text("name").notNullable()
    table.text("email").notNullable()
    table.text("password").notNullable()
    table.text("avatar")
    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable("users")
}
