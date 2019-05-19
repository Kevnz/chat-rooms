/* eslint-disable sonarjs/no-duplicate-string */
const Hapi = require('@hapi/hapi')
const rooms = require('../rooms')
let server
jest.mock('../../services/analytics')

describe('The Room Routes', () => {
  beforeEach(async () => {
    server = Hapi.server({
      port: 4343,
      host: 'localhost',
    })

    rooms.forEach(r => server.route(r))
    await server.start()
  })
  afterEach(async () => {
    await server.stop({ timeout: 100 })
  })
  it('should get the rooms', async () => {
    const injectOptions = {
      method: 'GET',
      url: '/rooms',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { payload } = await server.inject(injectOptions)
    const rooms = JSON.parse(payload)
    expect(rooms.length).toBe(10)
  })
  it('should get the messages for a room', async () => {
    const injectOptions = {
      method: 'GET',
      url: '/rooms/general',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { payload } = await server.inject(injectOptions)
    const messages = JSON.parse(payload)

    expect(messages.length).toBeGreaterThanOrEqual(0)
  })
  it('should join a chat room when a user is `PUT` on the route', async () => {
    const mockFN = jest.fn()
    const plug = {
      name: 'mock nes',
      version: '1.0.0',
      register: (server, options) => {
        server.decorate('server', 'publish', mockFN)
      },
    }
    await server.register(plug)

    const injectOptions = {
      method: 'PUT',
      url: '/rooms/general',
      payload: JSON.stringify({
        user: 'Test User',
      }),
    }
    await server.inject(injectOptions)
    expect(mockFN).toBeCalled()
  })
  it('should post a message to a chat room when a user is `POSTS` on the route', async () => {
    const mockFN = jest.fn()
    const plug = {
      name: 'mock nes',
      version: '1.0.0',
      register: (server, options) => {
        server.decorate('server', 'publish', mockFN)
      },
    }
    await server.register(plug)

    const injectOptions = {
      method: 'POST',
      url: '/rooms/general/message',
      payload: JSON.stringify({
        user: 'Test User',
        message: 'Hi there from the test user',
      }),
    }
    await server.inject(injectOptions)
    expect(mockFN).toBeCalled()
  })
  it('should get messages after some posts', async () => {
    const mockFN = jest.fn()
    const plug = {
      name: 'mock nes',
      version: '1.0.0',
      register: (server, options) => {
        server.decorate('server', 'publish', mockFN)
      },
    }
    await server.register(plug)

    const injectOptions = {
      method: 'POST',
      url: '/rooms/general/message',
      payload: JSON.stringify({
        user: 'Test User',
        message: 'Hi there from the test user',
      }),
    }
    await server.inject(injectOptions)
    const injectOptions2 = {
      method: 'POST',
      url: '/rooms/general/message',
      payload: JSON.stringify({
        user: 'Other User',
        message: 'Hi there from the other user',
      }),
    }
    await server.inject(injectOptions2)
    expect(mockFN).toBeCalled()

    const getOptions = {
      method: 'GET',
      url: '/rooms/general',
    }
    const { payload } = await server.inject(getOptions)
    const messages = JSON.parse(payload)

    expect(messages.length).toBeGreaterThanOrEqual(2)
  })
})
