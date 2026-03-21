const idParamsJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
  },
  required: ['id'],
}

const errorResponseJsonSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    details: { nullable: true },
  },
}

const clienteJsonSchema = {
  $id: 'Cliente',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    nome: { type: 'string' },
    telefone: { type: 'string' },
    email: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
  },
}

const clienteInputJsonSchema = {
  type: 'object',
  properties: {
    nome: { type: 'string' },
    telefone: { type: 'string' },
    email: { type: 'string', format: 'email' },
  },
  required: ['nome', 'telefone', 'email'],
}

const petJsonSchema = {
  $id: 'Pet',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    nome: { type: 'string' },
    tipo: { type: 'string' },
    raca: { type: 'string' },
    idade: { type: 'integer', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    clienteId: { type: 'integer' },
  },
}

const petInputJsonSchema = {
  type: 'object',
  properties: {
    nome: { type: 'string' },
    tipo: { type: 'string' },
    raca: { type: 'string' },
    idade: { type: 'integer' },
    clienteId: { type: 'integer' },
  },
  required: ['nome', 'tipo', 'raca', 'clienteId'],
}

const servicoJsonSchema = {
  $id: 'Servico',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    nome: { type: 'string' },
    preco: { type: 'string' },
    duracaoMin: { type: 'integer' },
    createdAt: { type: 'string', format: 'date-time' },
  },
}

const servicoInputJsonSchema = {
  type: 'object',
  properties: {
    nome: { type: 'string' },
    preco: { anyOf: [{ type: 'string' }, { type: 'number' }] },
    duracaoMin: { type: 'integer' },
  },
  required: ['nome', 'preco', 'duracaoMin'],
}

const agendamentoJsonSchema = {
  $id: 'Agendamento',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    dataHora: { type: 'string', format: 'date-time' },
    status: { type: 'string', enum: ['AGENDADO', 'CONCLUIDO', 'CANCELADO'] },
    valorCobrado: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    petId: { type: 'integer' },
    servicoId: { type: 'integer' },
  },
}

const agendamentoInputJsonSchema = {
  type: 'object',
  properties: {
    dataHora: { type: 'string', format: 'date-time' },
    status: { type: 'string', enum: ['AGENDADO', 'CONCLUIDO', 'CANCELADO'] },
    valorCobrado: { anyOf: [{ type: 'string' }, { type: 'number' }] },
    petId: { type: 'integer' },
    servicoId: { type: 'integer' },
  },
  required: ['dataHora', 'valorCobrado', 'petId', 'servicoId'],
}

const schemas = [
  clienteJsonSchema,
  petJsonSchema,
  servicoJsonSchema,
  agendamentoJsonSchema,
]

module.exports = {
  schemas,
  idParamsJsonSchema,
  errorResponseJsonSchema,
  clienteInputJsonSchema,
  petInputJsonSchema,
  servicoInputJsonSchema,
  agendamentoInputJsonSchema,
}
