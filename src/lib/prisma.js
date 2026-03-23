const { PrismaMariaDb } = require('@prisma/adapter-mariadb')
const { PrismaClient } = require('@prisma/client')

function normalizeDatabaseUrl(databaseUrl) {
  const url = new URL(databaseUrl)

  if (url.protocol === 'mysql:') {
    url.protocol = 'mariadb:'
  }

  const sslMode = url.searchParams.get('ssl-mode')
  const sslAccept = url.searchParams.get('sslaccept')

  if (sslMode && sslMode.toUpperCase() === 'REQUIRED') {
    url.searchParams.set('ssl', 'true')
    url.searchParams.delete('ssl-mode')
  }

  if (sslAccept && sslAccept.toLowerCase() === 'strict') {
    url.searchParams.set('ssl', 'true')
    url.searchParams.delete('sslaccept')
  }

  return url.toString()
}

function createMariaDbAdapter() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL nao configurada')
  }

  const normalizedUrl = normalizeDatabaseUrl(databaseUrl)

  return new PrismaMariaDb(normalizedUrl)
}

const prisma = new PrismaClient({
  adapter: createMariaDbAdapter(),
})

module.exports = { prisma }
