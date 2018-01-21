export abstract class QueuedJobsBase<TData, TResult> {
  public queue: Array<{ requestId: number, data: TData }> = []
  protected lastRequestId = 0
  constructor (private maxQueueLength = 50, private timeout = 30000) { }
  public registerHandler (handleData: (data: TData) => Promise<TResult>) {
    let isBusy = false
    this.on('new', async () => {
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

      this.once(`resolve:${requestId}`, (result: TResult | Error) => {
        clearTimeout(timer)
        resolve(result as TResult)
      })

      this.once(`reject:${requestId}`, (error: Error | TResult) => {
        clearTimeout(timer)
        reject(error as Error)
      })

      this.dispatchEvent('new')
    })
  }
  protected generateRequestId () {
    this.lastRequestId = this.lastRequestId < 4294967295 ? this.lastRequestId + 1 : 1 // 4294967295 = 2^32 - 1
    return this.lastRequestId
  }
  protected abstract dispatchEvent (eventName: string, data?: TResult | Error): void
  protected abstract once (eventName: string, callback: (data: TResult | Error) => void): void
  protected abstract on (eventName: string, callback: () => void): void
}
