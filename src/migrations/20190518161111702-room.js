exports.up = function(knex, Promise) {
  return knex.schema.createTable('rooms', function(table) {
    table.increments('id').primary()
    table.string('name')
    table.string('description')
    table.string('slug')
    table.string('icon')
    table.timestamps(true, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('rooms')
}
