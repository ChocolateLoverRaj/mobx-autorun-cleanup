import { autorun, IReactionPublic, IAutorunOptions, IReactionDisposer } from 'mobx'

export type Cleanup = () => void
export type Callback = (r: IReactionPublic) => Cleanup | undefined

export const autorunCleanup = (callback: Callback, options?: IAutorunOptions): IReactionDisposer => {
  let cleanup: Cleanup | undefined
  const _stop = autorun(r => {
    cleanup?.()
    cleanup = callback(r)
  }, options)
  return Object.assign(() => {
    _stop()
    cleanup?.()
  }, _stop)
}
