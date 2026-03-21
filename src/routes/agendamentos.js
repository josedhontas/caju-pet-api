const { z } = require('zod')

const { agendamentoInputJsonSchema, errorResponseJsonSchema, idParamsJsonSchema } = require('../docs/schemas')
const { notFoundError } = require('../utils/errors')
const { parseOrThrow, toDecimal } = require('../utils/validation')

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const agendamentoBodySchema = z.object({
  dataHora: z.iso.datetime(),
  status: z.enum(['AGENDADO', 'CONCLUIDO', 'CANCELADO']).optional(),
  valorCobrado: z.union([z.string(), z.number()]),
  petId: z.coerce.number().int().positive(),
  servicoId: z.coerce.number().int().positive(),
})

async function agendamentoRoutes(app) {
  app.get('/agendamentos', {
    schema: {
      tags: ['Agendamentos'],
      summary: 'Lista agendamentos',
      response: {
        200: {
          type: 'array',
          items: { $ref: 'Agendamento#' },
        },
      },
    },
  }, async () => {
    return app.prisma.agendamento.findMany({
      include: {
        pet: {
          include: {
            cliente: true,
          },
        },
        servico: true,
      },
      orderBy: {
        dataHora: 'asc',
      },
    })
  })

  app.get('/agendamentos/:id', {
    schema: {
      tags: ['Agendamentos'],
      summary: 'Busca um agendamento por ID',
      params: idParamsJsonSchema,
      response: {
        200: { $ref: 'Agendamento#' },
        404: errorResponseJsonSchema,
      },
    },
  }, async (request) => {
    const { id } = parseOrThrow(idParamSchema, request.params)

    const agendamento = await app.prisma.agendamento.findUnique({
      where: { id },
      include: {
        pet: {
          include: {
            cliente: true,
          },
        },
        servico: true,
      },
    })

    if (!agendamento) {
      throw notFoundError()
    }

    return agendamento
  })

  app.post('/agendamentos', {
    schema: {
      tags: ['Agendamentos'],
      summary: 'Cria um agendamento',
      body: agendamentoInputJsonSchema,
      response: {
        201: { $ref: 'Agendamento#' },
        400: errorResponseJsonSchema,
      },
    },
  }, async (request, reply) => {
    const body = parseOrThrow(agendamentoBodySchema, request.body)

    const agendamento = await app.prisma.agendamento.create({
      data: {
        ...body,
        dataHora: new Date(body.dataHora),
        valorCobrado: toDecimal(body.valorCobrado),
      },
    })

    return reply.code(201).send(agendamento)
  })

  app.put('/agendamentos/:id', {
    schema: {
      tags: ['Agendamentos'],
      summary: 'Atualiza um agendamento',
      params: idParamsJsonSchema,
      body: agendamentoInputJsonSchema,
      response: {
        200: { $ref: 'Agendamento#' },
        400: errorResponseJsonSchema,
        404: errorResponseJsonSchema,
      },
    },
  }, async (request) => {
    const { id } = parseOrThrow(idParamSchema, request.params)
    const body = parseOrThrow(agendamentoBodySchema, request.body)

    return app.prisma.agendamento.update({
      where: { id },
      data: {
        ...body,
        dataHora: new Date(body.dataHora),
        valorCobrado: toDecimal(body.valorCobrado),
      },
    })
  })

  app.delete('/agendamentos/:id', {
    schema: {
      tags: ['Agendamentos'],
      summary: 'Remove um agendamento',
      params: idParamsJsonSchema,
      response: {
        204: { type: 'null' },
        404: errorResponseJsonSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = parseOrThrow(idParamSchema, request.params)

    await app.prisma.agendamento.delete({
      where: { id },
    })

    return reply.code(204).send()
  })
}

module.exports = agendamentoRoutes
