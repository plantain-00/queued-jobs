import QueuedJobs from '../dist/nodejs/nodejs'

it('basic', async () => {
  const queuedJobs = new QueuedJobs<string, string>()
  queuedJobs.registerHandler(async (data) => {
    await sleep(100)
    return data + '-' + data
  })
  const result = await queuedJobs.handle('basic')
  expect(result).toEqual('basic-basic')
})

it('error', async () => {
  const queuedJobs = new QueuedJobs<string, string>()
  queuedJobs.registerHandler(async (data) => {
    await sleep(100)
    throw new Error(data + '-' + data)
  })
  await queuedJobs.handle('error').then(result => {
    fail()
  }).catch((error: Error) => {
    expect(error.message).toEqual('error-error')
  })
})

it('timeout', async () => {
  const queuedJobs = new QueuedJobs<string, string>(50, 1000)
  queuedJobs.registerHandler(async (data) => {
    await sleep(2000)
    return data + '-' + data
  })
  await queuedJobs.handle('timeout').then(result => {
    fail()
  }).catch((error: Error) => {
    expect(error.message).toEqual('timeout')
  })
})

it('queue overflow', async () => {
  const queuedJobs = new QueuedJobs<string, string>(1)
  queuedJobs.registerHandler(async (data) => {
    await sleep(1000)
    return data + '-' + data
  })

  queuedJobs.handle('queue overflow 0').then(result => {
    expect(result).toEqual('queue overflow 0-queue overflow 0')
  })

  queuedJobs.handle('queue overflow 1').then(result => {
    fail()
  }).catch((error: Error) => {
    expect(error.message).toEqual('queue overflow')
  })

  await queuedJobs.handle('queue overflow 2').then(result => {
    expect(result).toEqual('queue overflow 2-queue overflow 2')
  })
})

function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
