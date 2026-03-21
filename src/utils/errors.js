function createHttpError(statusCode, message, details) {
  const error = new Error(message)
  error.statusCode = statusCode
  error.details = details ?? null
  return error
}

function notFoundError() {
  return createHttpError(404, 'Registro nao encontrado')
}

function validationError(details) {
  return createHttpError(400, 'Dados invalidos', details)
}

module.exports = {
  createHttpError,
  notFoundError,
  validationError,
}
