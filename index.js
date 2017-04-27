#!/usr/bin/env node

const setup = require('./src/setup')
const lighthouse = require('./src/lighthouse')
const reporter = require('./src/reporter')
const argv = require('yargs-parser')(process.argv.slice(2))

const WAIT_BETWEEN_RUNS = 2500
const NUMBER_OF_RUNS = argv.runs || 3

const url = process.argv[2]

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

let runs = NUMBER_OF_RUNS

if (process.env.CI) setup()
lighthouse.throttle()
run()
