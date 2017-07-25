#!/usr/bin/env node

const setup = require('./src/setup')
const lighthouse = require('./src/lighthouse')
const reporter = require('./src/reporter')
let { runs, url, event_type } = require('./src/settings')
const build = require('./src/build')
const { event } = require('ci-env')
const { warn } = require('prettycli')

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
  if (event === 'pull_request' && event_type !== 'pull_request') {
    warn(
      `perfbench does not run on travis:pull_request

       If you would like to run this in travis:pull_request instead of travis:push,
       check configuration options: https://siddharthkp/perfbench#event
    `
    )
  } else {
    setup().then(start).catch(error => console.log('Setup failed', error))
  }
} else start()
