import { QueuedJobsBase } from './common'

/**
 * @public
 */
export default class QueuedJobs<TData = any, TResult = any> extends QueuedJobsBase<TData, TResult> {
  private eventTarget = document.createElement('div')
  protected dispatchEvent (eventName: string, data?: TResult | Error) {
    const event = new CustomEvent(eventName, { detail: data })
    this.eventTarget.dispatchEvent(event)
  }
  protected once (eventName: string, callback: (data: TResult | Error) => void) {
    const eventListenerCallback = (data: CustomEventInit) => {
      this.eventTarget.removeEventListener(eventName, eventListenerCallback)
      callback(data.detail)
    }
    this.eventTarget.addEventListener(eventName, eventListenerCallback)
  }
  protected on (eventName: string, callback: () => void) {
    this.eventTarget.addEventListener(eventName, (data: CustomEventInit) => {
      callback()
    })
  }
}
