import {
  defaultResolveConfig,
  build,
  start,
  watch,
  runTestcafe,
  merge,
  stop,
  reset,
  importEventStore,
  exportEventStore,
} from '@resolve-js/scripts'

import backendConfig from './config.app'
import clientConfig from './config.client'

import cloudConfig from './config.cloud'
import devConfig from './config.dev'
import prodConfig from './config.prod'
import testFunctionalConfig from './config.test-functional'

const launchMode = process.argv[2]

const appConfig = merge(backendConfig, clientConfig)

void (async () => {
  try {
    switch (launchMode) {
      case 'dev': {
        const resolveConfig = merge(defaultResolveConfig, appConfig, devConfig)
        await watch(resolveConfig)
        break
      }

      case 'build': {
        const resolveConfig = merge(defaultResolveConfig, appConfig, prodConfig)
        await build(resolveConfig)
        break
      }

      case 'cloud': {
        await build(merge(defaultResolveConfig, appConfig, cloudConfig))
        break
      }

      case 'start': {
        await start(merge(defaultResolveConfig, appConfig, prodConfig))
        break
      }

      case 'reset': {
        const resolveConfig = merge(defaultResolveConfig, appConfig, devConfig)
        await reset(resolveConfig, {
          dropEventStore: false,
          dropEventSubscriber: true,
          dropReadModels: true,
          dropSagas: true,
        })

        break
      }

      case 'import-event-store': {
        const resolveConfig = merge(defaultResolveConfig, appConfig, devConfig)

        const directory = process.argv[3]

        await importEventStore(resolveConfig, { directory })
        break
      }

      case 'export-event-store': {
        const resolveConfig = merge(defaultResolveConfig, appConfig, devConfig)

        const directory = process.argv[3]

        await exportEventStore(resolveConfig, { directory })
        break
      }

      case 'test:e2e': {
        const resolveConfig = merge(
          defaultResolveConfig,
          appConfig,
          testFunctionalConfig
        )

        await reset(resolveConfig, {
          dropEventStore: true,
          dropEventSubscriber: true,
          dropReadModels: true,
          dropSagas: true,
        })

        await runTestcafe({
          resolveConfig,
          functionalTestsDir: 'test/functional',
          browser: process.argv[3],
          customArgs: ['--stop-on-first-fail'],
        })
        break
      }

      default: {
        throw new Error('Unknown option')
      }
    }
    await stop()
  } catch (error) {
    await stop(error)
  }
})()
