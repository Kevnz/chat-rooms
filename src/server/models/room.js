const bookshelf = require('./bookshelf')

module.exports = bookshelf.model('Room', {
  tableName: 'rooms',
  idAttribute: 'id',
})
