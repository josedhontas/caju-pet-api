const { createHttpError } = require('./errors')

async function verifyAdminToken(request) {
  const adminToken = process.env.ADMIN_TOKEN

  if (!adminToken) {
    throw createHttpError(500, 'ADMIN_TOKEN nao configurado')
  }

  const authorization = request.headers.authorization

  if (!authorization) {
    throw createHttpError(401, 'Token de acesso nao informado')
  }

  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    throw createHttpError(401, 'Formato de autorizacao invalido')
  }

  if (token !== adminToken) {
    throw createHttpError(401, 'Token de acesso invalido')
  }

  request.log.info('Autenticacao admin aprovada')
}

module.exports = { verifyAdminToken }
