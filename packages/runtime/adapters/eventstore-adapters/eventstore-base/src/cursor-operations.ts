import assert from 'assert'
import {
  THREAD_COUNT,
  CURSOR_BUFFER_SIZE,
  THREAD_COUNTER_BYTE_LENGTH,
} from './constants'
import { Cursor, EventsWithCursor, EventWithCursor } from './types'

const checkThreadArrayLength = (threadArray: Array<number>): void => {
  assert.strictEqual(
    threadArray.length,
    THREAD_COUNT,
    'Cursor must be represented by array of 256 numbers'
  )
}

const checkThreadCounterHexString = (threadCounter: string): void => {
  assert.strictEqual(
    threadCounter.length,
    12,
    'threadCounter in hex form must have length equal to 12'
  )
}

export const initThreadArray = (): Array<number> => {
  const threadCounters = new Array<number>(THREAD_COUNT)
  threadCounters.fill(0)
  return threadCounters
}

export const threadArrayToCursor = (threadArray: Array<number>): string => {
  checkThreadArrayLength(threadArray)

  const cursorBuffer: Buffer = Buffer.alloc(CURSOR_BUFFER_SIZE)

  for (let i = 0; i < threadArray.length; ++i) {
    const threadCounter = threadArray[i]
    const threadCounterBuffer = threadCounterToBuffer(threadCounter)
    threadCounterBuffer.copy(cursorBuffer, i * THREAD_COUNTER_BYTE_LENGTH)
  }

  return cursorBuffer.toString('base64')
}

export const cursorToThreadArray = (cursor: Cursor): Array<number> => {
  if (cursor == null) return initThreadArray()

  const cursorBuffer = Buffer.from(cursor, 'base64')

  assert.strictEqual(
    cursorBuffer.length,
    CURSOR_BUFFER_SIZE,
    'Wrong size of cursor buffer'
  )

  const threadCounters = new Array<number>(THREAD_COUNT)
  for (let i = 0; i < cursorBuffer.length / THREAD_COUNTER_BYTE_LENGTH; i++) {
    threadCounters[i] = hexStringToThreadCounter(
      cursorBuffer.slice(i * 6, (i + 1) * 6).toString('hex')
    )
  }
  return threadCounters
}

export const threadCounterToHexString = (threadCounter: number): string =>
  threadCounter.toString(16).padStart(12, '0')

export const hexStringToThreadCounter = (threadCounter: string): number => {
  checkThreadCounterHexString(threadCounter)
  const num = parseInt(threadCounter, 16)
  assert(!Number.isNaN(num))
  return num
}

export const threadCounterHexStringToBuffer = (
  threadCounter: string
): Buffer => {
  checkThreadCounterHexString(threadCounter)
  const b: Buffer = Buffer.alloc(THREAD_COUNTER_BYTE_LENGTH)

  for (
    let hexIndex = 0, hexPairIndex = 0;
    hexIndex < threadCounter.length;
    hexIndex += 2, hexPairIndex++
  ) {
    b[hexPairIndex] = Buffer.from(
      threadCounter.substring(hexIndex, hexIndex + 2),
      'hex'
    )[0]
  }

  return b
}

export const threadCounterToBuffer = (threadCounter: number): Buffer => {
  return threadCounterHexStringToBuffer(threadCounterToHexString(threadCounter))
}

export const emptyLoadEventsResult = (cursor: Cursor): EventsWithCursor => {
  return {
    cursor: cursor == null ? threadArrayToCursor(initThreadArray()) : cursor,
    events: [],
  }
}

const calculateMaxThreadArray = (
  threadArrays: Array<Array<number>>
): Array<number> => {
  const maxThreadArray = initThreadArray()
  for (const threadArray of threadArrays) {
    checkThreadArrayLength(threadArray)
    for (let i = 0; i < THREAD_COUNT; ++i) {
      maxThreadArray[i] = Math.max(maxThreadArray[i], threadArray[i])
    }
  }
  return maxThreadArray
}

export const checkEventsContinuity = (
  startingCursor: Cursor,
  eventCursorPairs: EventWithCursor[]
): boolean => {
  const startingThreadArray = cursorToThreadArray(startingCursor)

  const tuples = eventCursorPairs.map(({ event, cursor }) => {
    return {
      event,
      cursor,
      threadArray: cursorToThreadArray(cursor),
    }
  })

  for (let i = 0; i < tuples.length; ++i) {
    assert.strictEqual(
      tuples[i].event.threadCounter,
      tuples[i].threadArray[tuples[i].event.threadId] - 1
    )
    if (
      startingThreadArray[tuples[i].event.threadId] >
      tuples[i].event.threadCounter
    ) {
      return false
    }
  }

  const maxThreadArray = calculateMaxThreadArray(
    tuples.map((t) => t.threadArray)
  )

  for (const t of tuples) {
    startingThreadArray[t.event.threadId]++
  }

  for (let i = 0; i < THREAD_COUNT; ++i) {
    if (maxThreadArray[i] !== startingThreadArray[i]) {
      return false
    }
  }
  return true
}
