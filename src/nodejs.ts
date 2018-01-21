import * as EventEmitter from 'events'
import { QueuedJobsBase } from './common'

class QueuedJobEmitter extends EventEmitter { }

/**
 * @public
 */
export default class QueuedJobs<TData = any, TResult = any> extends QueuedJobsBase<TData, TResult> {
  private emitter = new QueuedJobEmitter()
  protected dispatchEvent (eventName: string, data?: any) {
    this.emitter.emit(eventName)
  }
  protected addEventListener (eventName: string, callback: (data: any) => void) {
    this.emitter.addListener(eventName, callback)
  }
  protected removeEventListener (eventName: string, callback: (data: any) => void) {
    this.emitter.removeListener(eventName, callback)
  }
}
