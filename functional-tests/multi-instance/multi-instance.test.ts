import { nanoid } from 'nanoid'
import { Client } from 'resolve-client'

import { getClient } from '../utils/utils'

const MAIN_APP_ORIGIN = process.env.MAIN_APP_ORIGIN || 'http://127.0.0.1:3000'

const REPLICA_APP_ORIGIN =
  process.env.REPLICA_APP_ORIGIN || 'http://127.0.0.1:3001'

let mainClient: Client
let replicaClient: Client

beforeEach(() => {
  mainClient = getClient({
    origin: MAIN_APP_ORIGIN,
    viewModels: [
      {
        name: 'counter',
        deserializeState: (state: any) => state,
        projection: {
          Init: () => null,
        },
      },
    ],
  })

  replicaClient = getClient({
    origin: REPLICA_APP_ORIGIN,
    viewModels: [
      {
        name: 'counter',
        deserializeState: (state: any) => state,
        projection: {
          Init: () => null,
        },
      },
    ],
  })
})

void ([
  [() => mainClient, () => replicaClient, 'main app', 'replica app'],
  [() => replicaClient, () => mainClient, 'replica app', 'main app'],
] as [() => Client, () => Client, string, string][]).forEach(
  ([
    getClientToSendCommand,
    getClientToSendQuery,
    clientWithCommandTitle,
    clientWithQueryTitle,
  ]) => {
    test(`command sent to ${clientWithCommandTitle} affects ${clientWithQueryTitle} query`, async () => {
      const counterId = nanoid()

      await getClientToSendCommand().command({
        type: 'increase',
        aggregateName: 'Counter',
        aggregateId: counterId,
        payload: {},
      })

      const result = await getClientToSendQuery().query({
        name: 'counter',
        aggregateIds: [counterId],
        args: {},
      })

      if (result == null) {
        throw new Error('Unexpected query result')
      }

      expect(result.data).toEqual(1)
    })
  }
)
