import { observable, runInAction, reaction } from 'mobx'
import { autorunCleanup, Cleanup } from '../index'

describe('mobx-autorun-cleanup', () => {
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

  test('no cleanup returned', () => {
    const obj = observable({ theme: 'light' })

    // eslint-disable-next-line prefer-const
    let returnFn: Cleanup | undefined
    const stop = autorunCleanup(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      obj.theme
      return returnFn
    })

    returnFn = jest.fn()
    runInAction(() => {
      obj.theme = 'dark'
    })
    expect(returnFn).toBeCalledTimes(0)

    runInAction(() => {
      obj.theme = 'rainbow'
    })
    expect(returnFn).toBeCalledTimes(1)

    stop()
  })
})

// These tests show that the same thing can be achieved with mobx built-in `reaction`.
// However, this can get a little messy so there are still cases where using
// `mobx-autorun-cleanup` is helpful.
describe('mobx.reaction', () => {
  test('reactive', () => {
    const obj = observable({ theme: 'light' })
    const log: any[] = []
    const expectedLog: any[] = []

    log.push(obj.theme)
    const stop = reaction(() => obj.theme, currentTheme => {
      log.push(currentTheme)
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

    log.push(obj.theme)
    const stop = reaction(() => obj.theme, currentTheme => {
      log.push(currentTheme)
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

    log.push([Action.RUN, obj.theme])
    const stop = reaction(() => obj.theme, (currentTheme, previousTheme) => {
      log.push([Action.CLEANUP, previousTheme])
      log.push([Action.RUN, currentTheme])
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

    log.push([Action.RUN, obj.theme])
    const stop = reaction(() => obj.theme, (currentTheme, previousTheme) => {
      log.push([Action.CLEANUP, previousTheme])
      log.push([Action.RUN, currentTheme])
    })
    expectedLog.push([Action.RUN, 'light'])
    expect(log).toEqual(expectedLog)

    stop()
    log.push([Action.CLEANUP, obj.theme])
    expectedLog.push([Action.CLEANUP, 'light'])
    expect(log).toEqual(expectedLog)
  })

  test('no cleanup returned', () => {
    const obj = observable({ theme: 'light' })
    const stop = reaction(() => obj.theme, () => {
      // We don't return a fn here
    })
    stop()
  })
})
