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
    console.log({ error })
    expect(error.message).toEqual('timeout')
  })
})

function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
