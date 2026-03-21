const { PrismaMariaDb } = require('@prisma/adapter-mariadb')
const { PrismaClient } = require('@prisma/client')

function createMariaDbAdapter() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL nao configurada')
  }

  const normalizedUrl = databaseUrl
    .replace(/^mysql:\/\//, 'mariadb://')
    .replace('ssl-mode=REQUIRED', 'sslaccept=strict')

  return new PrismaMariaDb(normalizedUrl)
}

const prisma = new PrismaClient({
  adapter: createMariaDbAdapter(),
})

module.exports = { prisma }
