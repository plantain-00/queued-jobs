import EventEmitter from 'events'
import { QueuedJobsBase } from './common'

class QueuedJobEmitter extends EventEmitter { }

/**
 * @public
 */
export default class QueuedJobs<TData = any, TResult = any> extends QueuedJobsBase<TData, TResult> {
  private emitter = new QueuedJobEmitter()
  constructor(maxQueueLength = 50, timeout = 30000, maxListeners = 100) {
    super(maxQueueLength, timeout)
    this.emitter.setMaxListeners(maxListeners)
  }
  protected dispatchEvent(eventName: string, data?: TResult | Error) {
    this.emitter.emit(eventName, data)
  }
  protected once(eventName: string, callback: (data: TResult | Error) => void) {
    this.emitter.once(eventName, callback)
  }
  protected on(eventName: string, callback: () => void) {
    this.emitter.on(eventName, callback)
  }
}
