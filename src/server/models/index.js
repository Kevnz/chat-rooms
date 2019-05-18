const bookshelf = require('../bookshelf')
const User = require('./user')
const Room = require('./room')
const Users = bookshelf.Collection.extend({
  model: User,
})

const Rooms = bookshelf.Collection.extend({
  model: Room,
})

module.exports = {
  Room,
  Rooms,
  User,
  Users,
}
