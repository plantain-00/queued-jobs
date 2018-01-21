export abstract class QueuedJobsBase<TData, TResult> {
  public queue: Array<{ requestId: number, data: TData }> = []
  protected lastRequestId = 0
  constructor (protected maxQueueLength = 50, protected timeout = 30000) { }
  public registerHandler (handleData: (data: TData) => Promise<TResult>) {
    let isBusy = false
    this.addEventListener('new', async () => {
      if (!isBusy) {
        isBusy = true
        let item = this.queue.shift()
        while (item) {
          try {
            const result = await handleData(item.data)
            this.dispatchEvent(`resolve:${item.requestId}`, result)
          } catch (error) {
            this.dispatchEvent(`reject:${item.requestId}`, error)
          }
          item = this.queue.shift()
        }
        isBusy = false
      }
    })
  }
  public handle (data: TData) {
    return new Promise<TResult>((resolve, reject) => {
      const requestId = this.generateRequestId()
      while (this.queue.length >= this.maxQueueLength) {
        const item = this.queue.shift()
        if (item) {
          this.dispatchEvent(`reject:${item.requestId}`, new Error('queue overflow'))
        }
      }
      this.queue.push({ requestId, data })
      const timer = setTimeout(() => {
        reject(new Error('timeout'))
      }, this.timeout)
      const resolveCallback = (result: TResult) => {
        clearTimeout(timer)
        this.removeEventListener(`resolve:${requestId}`, resolveCallback)
        resolve(result)
      }
      this.addEventListener(`resolve:${requestId}`, resolveCallback)

      const rejectCallback = (error: Error) => {
        clearTimeout(timer)
        this.removeEventListener(`reject:${requestId}`, rejectCallback)
        reject(error)
      }
      this.addEventListener(`reject:${requestId}`, rejectCallback)

      this.dispatchEvent('new')
    })
  }
  protected generateRequestId () {
    this.lastRequestId = this.lastRequestId < 4294967295 ? this.lastRequestId + 1 : 1 // 4294967295 = 2^32 - 1
    return this.lastRequestId
  }
  protected abstract dispatchEvent (eventName: string, data?: any): void
  protected abstract addEventListener (eventName: string, callback: (data: any) => void): void
  protected abstract removeEventListener (eventName: string, callback: (data: any) => void): void
}
