const fs = require('fs')
const userGenerator = require('./generators/users')
const roomGenerator = require('./generators/rooms')
const random = (min, max) => Math.round(Math.random() * (max - min) + min)

const users = []
const rooms = []

for (let i = 1; i < 51; i++) {
  users.push(userGenerator(i))
}
rooms.push({
  id: 1,
  name: 'General',
  description: 'General Room',
  slug: 'general',
})
rooms.push({
  id: 2,
  name: 'Random',
  description: 'Random Talk Room',
  slug: 'random',
})
for (let i = 3; i < 11; i++) {
  rooms.push(roomGenerator(i))
}

const userContent = JSON.stringify(users, null, 2)
const roomContent = JSON.stringify(rooms, null, 2)

fs.writeFileSync('./src/fixtures/users-fixture.json', userContent)
fs.writeFileSync('./src/fixtures/rooms-fixture.json', roomContent)
