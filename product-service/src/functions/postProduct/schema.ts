export default {
  type: "object",
  properties: {
    number: { type: 'number' },
    product: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
      },
      required: ['title', 'description', 'price']
    }
  },
  required: ['product']
} as const;
