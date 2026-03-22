const fastify = require('fastify')

const { registerDocs } = require('./docs')
const { schemas } = require('./docs/schemas')
const { prisma } = require('./lib/prisma')
const { verifyAdminToken } = require('./utils/auth')
const { errorHandler } = require('./utils/error-handler')
const healthRoutes = require('./routes/health')
const clienteRoutes = require('./routes/clientes')
const petRoutes = require('./routes/pets')
const servicoRoutes = require('./routes/servicos')
const agendamentoRoutes = require('./routes/agendamentos')

function buildApp() {
  const app = fastify({ logger: true })

  app.decorate('prisma', prisma)

  app.addHook('onRequest', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*')
    reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    reply.header(
      'Access-Control-Allow-Headers',
      'Authorization, Content-Type, Accept, Origin, X-Requested-With',
    )
    reply.header('Access-Control-Max-Age', '86400')

    if (request.method === 'OPTIONS') {
      return reply.code(204).send()
    }
  })

  for (const schema of schemas) {
    app.addSchema(schema)
  }

  app.setErrorHandler(errorHandler)

  app.addHook('onClose', async () => {
    await prisma.$disconnect()
  })

  registerDocs(app)
  app.register(healthRoutes)
  app.register(async function protectedRoutes(protectedApp) {
    protectedApp.addHook('onRequest', verifyAdminToken)

    protectedApp.register(clienteRoutes)
    protectedApp.register(petRoutes)
    protectedApp.register(servicoRoutes)
    protectedApp.register(agendamentoRoutes)
  })

  return app
}

module.exports = { buildApp }
