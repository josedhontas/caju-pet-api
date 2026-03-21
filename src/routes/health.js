async function healthRoutes(app) {
  app.get('/', {
    schema: {
      tags: ['Health'],
      summary: 'Verifica se a API esta online',
      security: [],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  }, async () => {
    return { message: 'Caju Pet API rodando' }
  })
}

module.exports = healthRoutes
