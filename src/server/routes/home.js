module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: (request, h) => {
        return request.file('index.html')
      },
    },
  },
]
