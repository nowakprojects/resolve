import createApi from '../src/create_api'

describe('createApi', () => {
  test('should return correctly API', () => {
    const rootPath = 'test'
    const origin = 'http://localhost:3000'
    const queryMethod = 'GET'
    const api = createApi({ origin, rootPath, queryMethod })

    expect(api.loadViewModelState).toBeInstanceOf(Function)
    expect(api.loadReadModelState).toBeInstanceOf(Function)
    expect(api.sendCommand).toBeInstanceOf(Function)
    expect(api.getSubscribeAdapterOptions).toBeInstanceOf(Function)
  })
})
