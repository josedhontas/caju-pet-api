require('dotenv/config')

const { buildApp } = require('./app')
const { prisma } = require('./lib/prisma')

const port = Number(process.env.PORT || 3333)

async function start() {
  const app = buildApp()

  try {
    await prisma.$connect()
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`Servidor rodando na porta ${port}`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()
