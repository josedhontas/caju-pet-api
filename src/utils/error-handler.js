function errorHandler(error, request, reply) {
  request.log.error(error)

  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      error: error.message,
      details: error.details ?? null,
    })
  }

  if (error.code === 'P2025') {
    return reply.status(404).send({ error: 'Registro nao encontrado' })
  }

  if (error.code === 'P2002') {
    return reply.status(409).send({ error: 'Registro duplicado' })
  }

  if (error.code === 'P2003') {
    return reply.status(409).send({ error: 'Registro vinculado a outro recurso' })
  }

  return reply.status(500).send({ error: 'Erro interno do servidor' })
}

module.exports = { errorHandler }
