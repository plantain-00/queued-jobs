# queued-jobs

A library to handle jobs in a smooth way with help of queue for nodejs and browser

[![Dependency Status](https://david-dm.org/plantain-00/queued-jobs.svg)](https://david-dm.org/plantain-00/queued-jobs)
[![devDependency Status](https://david-dm.org/plantain-00/queued-jobs/dev-status.svg)](https://david-dm.org/plantain-00/queued-jobs#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/plantain-00/queued-jobs.svg?branch=master)](https://travis-ci.org/plantain-00/queued-jobs)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/plantain-00/queued-jobs?branch=master&svg=true)](https://ci.appveyor.com/project/plantain-00/queued-jobs/branch/master)
[![npm version](https://badge.fury.io/js/queued-jobs.svg)](https://badge.fury.io/js/queued-jobs)
[![Downloads](https://img.shields.io/npm/dm/queued-jobs.svg)](https://www.npmjs.com/package/queued-jobs)
[![gzip size](https://img.badgesize.io/https://unpkg.com/queued-jobs?compression=gzip)](https://unpkg.com/queued-jobs)

## scene

It should be one queue, multiple workers.

All workers will try to fetch one job data from the queue, if one worker fails to fetch one, it will stop; otherwise it will handle the job.

A worker will wait asynchronously, until the job is success, or error, or timeout, then it will try to fetch one another job data from the queue, just like before.

if queue's length > `maxQueueLength`, the front item will be removed and errored immidiately, until queue's length <= `maxQueueLength`

## install

`yarn add queued-jobs`

## usage

```ts
// nodejs:
import QueuedJobs from "queued-jobs/nodejs/nodejs";

// browser(module):
import QueuedJobs from "queued-jobs/browser/browser";

// browser(script tag):
// <script src="./node_modules/queued-jobs/queued-jobs.min.js"></script>

// only one queue
const queuedJobs = new QueuedJobs()

// multiple workers
for (let i = 0; i < 2; i++) {
    queuedJobs.registerHandler(async (data) => {
        // do heavy work
        return 'abc'
    })
}

// a new job
const data = 123
const result = await queuedJobs.handle(data)
```

## options

```ts
const queuedJobs = new QueuedJobs(50 /* max queue length */, 30000 /* timeout */, 100 /* max listeners */)
```
