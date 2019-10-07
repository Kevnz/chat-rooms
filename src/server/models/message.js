
const bookshelf = require('./bookshelf');

module.exports = bookshelf.model('Message', {
  tableName: 'messages',
  idAttribute: 'id'
});
