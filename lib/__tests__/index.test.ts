import { observable, runInAction } from 'mobx'
import { autorunCleanup } from '../index'

test('reactive', () => {
  const obj = observable({ theme: 'light' })
  const log: any[] = []
  const expectedLog: any[] = []

  const stop = autorunCleanup(() => {
    log.push(obj.theme)
    return () => {}
  })
  expectedLog.push('light')
  expect(log).toEqual(expectedLog)

  runInAction(() => {
    obj.theme = 'dark'
  })
  expectedLog.push('dark')
  expect(log).toEqual(expectedLog)

  runInAction(() => {
    obj.theme = 'dark'
  })
  expect(log).toEqual(expectedLog)

  stop()
})

test('stop', () => {
  const obj = observable({ theme: 'light' })
  const log: any[] = []
  const expectedLog: any[] = []

  const stop = autorunCleanup(() => {
    log.push(obj.theme)
    return () => {}
  })
  expectedLog.push('light')
  expect(log).toEqual(expectedLog)

  stop()

  runInAction(() => {
    obj.theme = 'dark'
  })
  expect(log).toEqual(expectedLog)
})

enum Action { RUN, CLEANUP }

test('cleanup on re-run', () => {
  const obj = observable({ theme: 'light' })
  const log: Array<[Action, any]> = []
  const expectedLog: Array<[Action, any]> = []

  const stop = autorunCleanup(() => {
    const currentTheme = obj.theme
    log.push([Action.RUN, currentTheme])
    return () => {
      log.push([Action.CLEANUP, currentTheme])
    }
  })
  expectedLog.push([Action.RUN, 'light'])
  expect(log).toEqual(expectedLog)

  runInAction(() => {
    obj.theme = 'dark'
  })
  expectedLog.push([Action.CLEANUP, 'light'], [Action.RUN, 'dark'])
  expect(log).toEqual(expectedLog)

  stop()
})

test('cleanup on stop', () => {
  const obj = observable({ theme: 'light' })
  const log: Array<[Action, any]> = []
  const expectedLog: Array<[Action, any]> = []

  const stop = autorunCleanup(() => {
    const currentTheme = obj.theme
    log.push([Action.RUN, currentTheme])
    return () => {
      log.push([Action.CLEANUP, currentTheme])
    }
  })
  expectedLog.push([Action.RUN, 'light'])
  expect(log).toEqual(expectedLog)

  stop()
  expectedLog.push([Action.CLEANUP, 'light'])
  expect(log).toEqual(expectedLog)
})
