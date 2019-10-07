exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', function(table) {
    table.increments('id').primary()
    table.string('text')
    table.string('type')
    table.string('userId')
    table.string('postedAt')
    table.timestamps(true, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages')
}
