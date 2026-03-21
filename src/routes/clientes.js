const { z } = require('zod')

const { clienteInputJsonSchema, errorResponseJsonSchema, idParamsJsonSchema } = require('../docs/schemas')
const { notFoundError } = require('../utils/errors')
const { parseOrThrow } = require('../utils/validation')

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const clienteBodySchema = z.object({
  nome: z.string().trim().min(1),
  telefone: z.string().trim().min(8),
  email: z.string().trim().email().toLowerCase(),
})

async function clienteRoutes(app) {
  app.get('/clientes', {
    schema: {
      tags: ['Clientes'],
      summary: 'Lista clientes',
      response: {
        200: {
          type: 'array',
          items: { $ref: 'Cliente#' },
        },
      },
    },
  }, async () => {
    app.log.info('GET /clientes: iniciando consulta')

    const clientes = await app.prisma.cliente.findMany({
      include: {
        pets: true,
      },
      orderBy: {
        id: 'asc',
      },
    })

    app.log.info({ totalClientes: clientes.length }, 'GET /clientes: consulta finalizada')

    return clientes
  })

  app.get('/clientes/:id', {
    schema: {
      tags: ['Clientes'],
      summary: 'Busca um cliente por ID',
      params: idParamsJsonSchema,
      response: {
        200: { $ref: 'Cliente#' },
        404: errorResponseJsonSchema,
      },
    },
  }, async (request) => {
    const { id } = parseOrThrow(idParamSchema, request.params)

    const cliente = await app.prisma.cliente.findUnique({
      where: { id },
      include: {
        pets: {
          include: {
            agendamentos: {
              include: {
                servico: true,
              },
            },
          },
        },
      },
    })

    if (!cliente) {
      throw notFoundError()
    }

    return cliente
  })

  app.post('/clientes', {
    schema: {
      tags: ['Clientes'],
      summary: 'Cria um cliente',
      body: clienteInputJsonSchema,
      response: {
        201: { $ref: 'Cliente#' },
        400: errorResponseJsonSchema,
      },
    },
  }, async (request, reply) => {
    const body = parseOrThrow(clienteBodySchema, request.body)

    const cliente = await app.prisma.cliente.create({
      data: body,
    })

    return reply.code(201).send(cliente)
  })

  app.put('/clientes/:id', {
    schema: {
      tags: ['Clientes'],
      summary: 'Atualiza um cliente',
      params: idParamsJsonSchema,
      body: clienteInputJsonSchema,
      response: {
        200: { $ref: 'Cliente#' },
        400: errorResponseJsonSchema,
        404: errorResponseJsonSchema,
      },
    },
  }, async (request) => {
    const { id } = parseOrThrow(idParamSchema, request.params)
    const body = parseOrThrow(clienteBodySchema, request.body)

    return app.prisma.cliente.update({
      where: { id },
      data: body,
    })
  })

  app.delete('/clientes/:id', {
    schema: {
      tags: ['Clientes'],
      summary: 'Remove um cliente',
      params: idParamsJsonSchema,
      response: {
        204: { type: 'null' },
        404: errorResponseJsonSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = parseOrThrow(idParamSchema, request.params)

    await app.prisma.cliente.delete({
      where: { id },
    })

    return reply.code(204).send()
  })
}

module.exports = clienteRoutes
