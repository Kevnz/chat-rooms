module.exports = [
  {
    method: 'GET',
    path: '/homegrown',
    config: {
      handler: (request, h) => {
        return request.file('index.html')
      },
    },
  },
]
