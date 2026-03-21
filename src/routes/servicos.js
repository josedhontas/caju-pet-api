const { z } = require('zod')

const { errorResponseJsonSchema, idParamsJsonSchema, servicoInputJsonSchema } = require('../docs/schemas')
const { notFoundError } = require('../utils/errors')
const { parseOrThrow, toDecimal } = require('../utils/validation')

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const servicoBodySchema = z.object({
  nome: z.string().trim().min(1),
  preco: z.union([z.string(), z.number()]),
  duracaoMin: z.coerce.number().int().positive(),
})

async function servicoRoutes(app) {
  app.get('/servicos', {
    schema: {
      tags: ['Servicos'],
      summary: 'Lista servicos',
      response: {
        200: {
          type: 'array',
          items: { $ref: 'Servico#' },
        },
      },
    },
  }, async () => {
    return app.prisma.servico.findMany({
      include: {
        agendamentos: true,
      },
      orderBy: {
        id: 'asc',
      },
    })
  })

  app.get('/servicos/:id', {
    schema: {
      tags: ['Servicos'],
      summary: 'Busca um servico por ID',
      params: idParamsJsonSchema,
      response: {
        200: { $ref: 'Servico#' },
        404: errorResponseJsonSchema,
      },
    },
  }, async (request) => {
    const { id } = parseOrThrow(idParamSchema, request.params)

    const servico = await app.prisma.servico.findUnique({
      where: { id },
      include: {
        agendamentos: {
          include: {
            pet: true,
          },
        },
      },
    })

    if (!servico) {
      throw notFoundError()
    }

    return servico
  })

  app.post('/servicos', {
    schema: {
      tags: ['Servicos'],
      summary: 'Cria um servico',
      body: servicoInputJsonSchema,
      response: {
        201: { $ref: 'Servico#' },
        400: errorResponseJsonSchema,
      },
    },
  }, async (request, reply) => {
    const body = parseOrThrow(servicoBodySchema, request.body)

    const servico = await app.prisma.servico.create({
      data: {
        ...body,
        preco: toDecimal(body.preco),
      },
    })

    return reply.code(201).send(servico)
  })

  app.put('/servicos/:id', {
    schema: {
      tags: ['Servicos'],
      summary: 'Atualiza um servico',
      params: idParamsJsonSchema,
      body: servicoInputJsonSchema,
      response: {
        200: { $ref: 'Servico#' },
        400: errorResponseJsonSchema,
        404: errorResponseJsonSchema,
      },
    },
  }, async (request) => {
    const { id } = parseOrThrow(idParamSchema, request.params)
    const body = parseOrThrow(servicoBodySchema, request.body)

    return app.prisma.servico.update({
      where: { id },
      data: {
        ...body,
        preco: toDecimal(body.preco),
      },
    })
  })

  app.delete('/servicos/:id', {
    schema: {
      tags: ['Servicos'],
      summary: 'Remove um servico',
      params: idParamsJsonSchema,
      response: {
        204: { type: 'null' },
        404: errorResponseJsonSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = parseOrThrow(idParamSchema, request.params)

    await app.prisma.servico.delete({
      where: { id },
    })

    return reply.code(204).send()
  })
}

module.exports = servicoRoutes
