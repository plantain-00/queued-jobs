import { QueuedJobsBase } from './common'

/**
 * @public
 */
export default class QueuedJobs<TData = any, TResult = any> extends QueuedJobsBase<TData, TResult> {
  private eventTarget = document.createElement('div')
  protected dispatchEvent (eventName: string, data?: any) {
    const event = new CustomEvent(eventName, { detail: data })
    this.eventTarget.dispatchEvent(event)
  }
  protected addEventListener (eventName: string, callback: (data: any) => void) {
    this.eventTarget.addEventListener(eventName, callback)
  }
  protected removeEventListener (eventName: string, callback: (data: any) => void) {
    this.eventTarget.removeEventListener(eventName, callback)
  }
}
