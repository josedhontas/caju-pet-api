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

  const rootCauseMessage =
    error?.cause?.cause ||
    error?.cause?.originalMessage ||
    error?.cause?.message ||
    error?.message ||
    ''

  if (
    error?.name === 'DriverAdapterError' ||
    error?.name === 'PrismaClientInitializationError' ||
    /pool timeout|getaddrinfo|connect|ECONNREFUSED|ENOTFOUND|ETIMEDOUT/i.test(rootCauseMessage)
  ) {
    return reply.status(503).send({ error: 'Banco de dados indisponivel' })
  }

  return reply.status(500).send({ error: 'Erro interno do servidor' })
}

module.exports = { errorHandler }
