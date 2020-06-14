import test from 'ava'

import QueuedJobs from '../src/nodejs'

test('basic', async(t) => {
  const queuedJobs = new QueuedJobs<string, string>()
  queuedJobs.registerHandler(async(data) => {
    await sleep(100)
    return data + '-' + data
  })
  const result = await queuedJobs.handle('basic')
  t.is(result, 'basic-basic')
})

test('error', async(t) => {
  const queuedJobs = new QueuedJobs<string, string>()
  queuedJobs.registerHandler(async(data) => {
    await sleep(100)
    throw new Error(data + '-' + data)
  })
  await queuedJobs.handle('error').then(result => {
    t.fail()
  }).catch((error: Error) => {
    t.is(error.message, 'error-error')
  })
})

test('timeout', async(t) => {
  const queuedJobs = new QueuedJobs<string, string>(50, 1000)
  queuedJobs.registerHandler(async(data) => {
    await sleep(2000)
    return data + '-' + data
  })
  await queuedJobs.handle('timeout').then(result => {
    t.fail()
  }).catch((error: Error) => {
    t.is(error.message, 'timeout')
  })
})

test('queue overflow', async(t) => {
  const queuedJobs = new QueuedJobs<string, string>(1)
  queuedJobs.registerHandler(async(data) => {
    await sleep(1000)
    return data + '-' + data
  })

  queuedJobs.handle('queue overflow 0').then(result => {
    t.is(result, 'queue overflow 0-queue overflow 0')
  })

  queuedJobs.handle('queue overflow 1').then(result => {
    t.fail()
  }).catch((error: Error) => {
    t.is(error.message, 'queue overflow')
  })

  await queuedJobs.handle('queue overflow 2').then(result => {
    t.is(result, 'queue overflow 2-queue overflow 2')
  })
})

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
