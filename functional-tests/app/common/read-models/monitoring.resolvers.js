const resolvers = {
  resolverA: async () => {
    throw Error('Test read model: resolverA failure')
  },
  resolverB: async () => {
    throw Error('Test read model: resolverB failure')
  },
}
export default resolvers
