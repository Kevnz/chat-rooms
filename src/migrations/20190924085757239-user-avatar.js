exports.up = knex =>
  knex.schema.table('users', table => {
    table
      .text('avatar')
      .defaultTo('https://api.adorable.io/avatars/120/kev-chat-roomz.png')
  })

exports.down = knex =>
  knex.schema.dropColumn('users', table => {
    table.text('avatar')
  })
