const { z } = require('zod')

const { errorResponseJsonSchema, idParamsJsonSchema, petInputJsonSchema } = require('../docs/schemas')
const { notFoundError } = require('../utils/errors')
const { parseOrThrow } = require('../utils/validation')

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const petBodySchema = z.object({
  nome: z.string().trim().min(1),
  tipo: z.string().trim().min(1),
  raca: z.string().trim().min(1),
  idade: z.coerce.number().int().positive().optional(),
  clienteId: z.coerce.number().int().positive(),
})

async function petRoutes(app) {
  app.get('/pets', {
    schema: {
      tags: ['Pets'],
      summary: 'Lista pets',
      response: {
        200: {
          type: 'array',
          items: { $ref: 'Pet#' },
        },
      },
    },
  }, async () => {
    return app.prisma.pet.findMany({
      include: {
        cliente: true,
        agendamentos: {
          include: {
            servico: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    })
  })

  app.get('/pets/:id', {
    schema: {
      tags: ['Pets'],
      summary: 'Busca um pet por ID',
      params: idParamsJsonSchema,
      response: {
        200: { $ref: 'Pet#' },
        404: errorResponseJsonSchema,
      },
    },
  }, async (request) => {
    const { id } = parseOrThrow(idParamSchema, request.params)

    const pet = await app.prisma.pet.findUnique({
      where: { id },
      include: {
        cliente: true,
        agendamentos: {
          include: {
            servico: true,
          },
        },
      },
    })

    if (!pet) {
      throw notFoundError()
    }

    return pet
  })

  app.post('/pets', {
    schema: {
      tags: ['Pets'],
      summary: 'Cria um pet',
      body: petInputJsonSchema,
      response: {
        201: { $ref: 'Pet#' },
        400: errorResponseJsonSchema,
      },
    },
  }, async (request, reply) => {
    const body = parseOrThrow(petBodySchema, request.body)

    const pet = await app.prisma.pet.create({
      data: body,
    })

    return reply.code(201).send(pet)
  })

  app.put('/pets/:id', {
    schema: {
      tags: ['Pets'],
      summary: 'Atualiza um pet',
      params: idParamsJsonSchema,
      body: petInputJsonSchema,
      response: {
        200: { $ref: 'Pet#' },
        400: errorResponseJsonSchema,
        404: errorResponseJsonSchema,
      },
    },
  }, async (request) => {
    const { id } = parseOrThrow(idParamSchema, request.params)
    const body = parseOrThrow(petBodySchema, request.body)

    return app.prisma.pet.update({
      where: { id },
      data: body,
    })
  })

  app.delete('/pets/:id', {
    schema: {
      tags: ['Pets'],
      summary: 'Remove um pet',
      params: idParamsJsonSchema,
      response: {
        204: { type: 'null' },
        404: errorResponseJsonSchema,
      },
    },
  }, async (request, reply) => {
    const { id } = parseOrThrow(idParamSchema, request.params)

    await app.prisma.pet.delete({
      where: { id },
    })

    return reply.code(204).send()
  })
}

module.exports = petRoutes
