#!/usr/bin/env node

const setup = require('./src/setup')
const lighthouse = require('./src/lighthouse')
const reporter = require('./src/reporter')
let { runs, url } = require('./src/settings')

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

try {
  if (process.env.CI) setup()
} catch (error) {
  console.log('--------setup---------')
  console.log(error)
}
try {
  lighthouse.throttle()
} catch (error) {
  console.log('--------throttle---------')
  console.log(error)
}

try {
  run()
} catch (error) {
  console.log('--------run---------')
  console.log(error)
}
