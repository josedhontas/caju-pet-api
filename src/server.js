require('dotenv/config')

const { buildApp } = require('./app')
const { prisma } = require('./lib/prisma')

async function start() {
  const app = buildApp()

  try {
    await prisma.$connect()
    await app.listen({ port: 3333, host: '0.0.0.0' })
    console.log('Servidor rodando na porta 3333')
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()
