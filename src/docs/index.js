const swagger = require('@fastify/swagger')
const swaggerUi = require('@fastify/swagger-ui')

function normalizeUrl(url) {
  return String(url).replace(/\/+$/, '')
}

function getForwardedValue(value) {
  if (!value) {
    return undefined
  }

  return String(value).split(',')[0].trim()
}

function getPublicServerUrl(request) {
  if (process.env.PUBLIC_API_URL) {
    return normalizeUrl(process.env.PUBLIC_API_URL)
  }

  const forwardedProto = getForwardedValue(request.headers['x-forwarded-proto'])
  const forwardedHost = getForwardedValue(request.headers['x-forwarded-host'])
  const forwardedPort = getForwardedValue(request.headers['x-forwarded-port'])
  const host = forwardedHost || request.headers.host

  if (!host) {
    return `http://localhost:${process.env.PORT || 3333}`
  }

  const protocol = forwardedProto || request.protocol || 'http'
  const shouldAppendPort =
    forwardedPort &&
    !String(host).includes(':') &&
    forwardedPort !== '80' &&
    forwardedPort !== '443'

  return `${protocol}://${host}${shouldAppendPort ? `:${forwardedPort}` : ''}`
}

function registerDocs(app) {
  const defaultServerUrl = process.env.PUBLIC_API_URL
    ? normalizeUrl(process.env.PUBLIC_API_URL)
    : `http://localhost:${process.env.PORT || 3333}`

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
          url: defaultServerUrl,
          description: 'Servidor atual',
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
    transformSpecification: (swaggerObject, request) => {
      swaggerObject.servers = [
        {
          url: getPublicServerUrl(request),
          description: 'Servidor atual',
        },
      ]

      return swaggerObject
    },
    transformSpecificationClone: true,
  })
}

module.exports = { registerDocs }
