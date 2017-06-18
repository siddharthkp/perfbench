#!/usr/bin/env node

const setup = require('./src/setup')
const lighthouse = require('./src/lighthouse')
const reporter = require('./src/reporter')
let { runs, url } = require('./src/settings')
const build = require('./src/build')

const WAIT_BETWEEN_RUNS = 2500

const results = []

const run = () => {
  runs = runs - 1
  lighthouse
    .run(url)
    .then(result => {
      results.push(result)
      if (runs > 0) setTimeout(run, WAIT_BETWEEN_RUNS)
      else reporter.print(results)
    })
    .catch(err => {
      throw err
    })
}

const start = () => {
  lighthouse.throttle()
  run()
}

process.on('unhandledRejection', function(reason, p) {
  console.log('Unhandled Promise: ', p, ' reason: ', reason)
  build.error()
})

if (process.env.CI) {
  setup().then(start).catch(error => console.log('Setup failed', error))
} else start()
