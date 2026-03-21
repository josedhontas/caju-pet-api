const swagger = require('@fastify/swagger')
const swaggerUi = require('@fastify/swagger-ui')

function registerDocs(app) {
  app.register(swagger, {
    openapi: {
      info: {
        title: 'Caju Pet API',
        description: 'Documentacao para teste das rotas de clientes, pets, servicos e agendamentos.',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'API Token',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      servers: [
        {
          url: 'http://localhost:3333',
          description: 'Servidor local',
        },
      ],
      tags: [
        { name: 'Health', description: 'Status da API' },
        { name: 'Clientes', description: 'Rotas de clientes' },
        { name: 'Pets', description: 'Rotas de pets' },
        { name: 'Servicos', description: 'Rotas de servicos' },
        { name: 'Agendamentos', description: 'Rotas de agendamentos' },
      ],
    },
  })

  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecificationClone: true,
  })
}

module.exports = { registerDocs }
