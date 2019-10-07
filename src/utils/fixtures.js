const fs = require('fs')
const userGenerator = require('./generators/users')
const roomGenerator = require('./generators/rooms')
const random = (min, max) => Math.round(Math.random() * (max - min) + min)

const users = []
const rooms = []

for (let i = 1; i < 51; i++) {
  users.push(userGenerator(i))
}

users.push({
  id: 51,
  firstName: 'Kevin',
  lastName: 'Isom',
  username: 'the_kev',
  email: 'kevin_isom@the-kev.com',
  password: 'whDhnNBcOjdZVxa',
  hashedPassword:
    '$2b$10$pJEslmCtekRfq0QgeqqFuOksHMw4k5fe/OIyTMtK/ZqQwGIkpX8Uq',
  avatar: 'https://api.adorable.io/avatars/face/eyes1/nose3/mouth2/00abff',
})

rooms.push({
  id: 1,
  name: 'General',
  description: 'General Room',
  slug: 'general',
  icon: 'inbox',
})
rooms.push({
  id: 2,
  name: 'Random',
  description: 'Random Talk Room',
  slug: 'random',
  icon: 'random',
})
for (let i = 3; i < 11; i++) {
  rooms.push(roomGenerator(i))
}

const userContent = JSON.stringify(users, null, 2)
const roomContent = JSON.stringify(rooms, null, 2)

fs.writeFileSync('./src/fixtures/users-fixture.json', userContent)
fs.writeFileSync('./src/fixtures/rooms-fixture.json', roomContent)
