const { Prisma } = require('@prisma/client')

const { validationError } = require('./errors')

function parseOrThrow(schema, data) {
  const result = schema.safeParse(data)

  if (!result.success) {
    throw validationError(result.error.flatten())
  }

  return result.data
}

function toDecimal(value) {
  try {
    return new Prisma.Decimal(value)
  } catch {
    throw validationError({
      formErrors: [],
      fieldErrors: {
        valor: ['Valor monetario invalido'],
      },
    })
  }
}

module.exports = {
  parseOrThrow,
  toDecimal,
}
