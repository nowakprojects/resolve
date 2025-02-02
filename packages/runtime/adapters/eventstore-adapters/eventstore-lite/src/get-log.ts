import logScope, { LeveledDebugger } from '@resolve-js/debug-levels'

export const getLog = (scope: string): LeveledDebugger & debug.Debugger =>
  logScope(`resolve:event-store-sqlite:${scope}`)
