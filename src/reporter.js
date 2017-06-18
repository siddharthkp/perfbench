const fs = require('fs')
const Table = require('cli-table2')
const { white, yellow, green, red } = require('colors/safe')
const statistics = require('statistics')
const kebabcase = require('lodash.kebabcase')

const build = require('./build')
const { units } = require('./properties')
let { debug, fail, thresholds } = require('./settings')
const store = require('./api')

/* Table headers */
let head = [white('Property'), white('Values'), white('Threshold')]
let table = new Table({ head })

let error = false
let unreliableResults = []
let master = {}

const print = results => {
  if (debug) fs.writeFileSync('./debug.json', JSON.stringify(results, null, 2))

  /*
    If store is enabled
    1. fetch values from api
    2. add column in table header
  */
  if (store.enabled) {
    table.options.head.splice(2, 0, white('Master'))
    master = store.get()
  }

  /* Print the test conditions */
  console.log('Test conditions: \n')
  const conditions = results[0].runtimeConfig.environment
  for (let { enabled, name, description } of conditions) {
    if (enabled) console.log(yellow(name), yellow(description))
  }

  /* Flatten user timings results */
  for (let i = 0; i < results.length; i++) {
    results[i].audits['user-timings'].extendedInfo.value.map(
      audit =>
        (results[i].audits[kebabcase(audit.name)] = {
          description: audit.name,
          rawValue: audit.startTime
        })
    )
    delete results[i].audits['user-timings']
  }

  /* Get all the audit keys */
  const keys = Object.keys(results[0].audits)
  let values = []

  for (let key of keys) {
    const property = results[0].audits[key].description
    const threshold = thresholds[key] || 0

    for (let i = 0; i < results.length; i++) {
      values.push(results[i].audits[key].rawValue)
    }

    if (debug) console.log(property, threshold, values)

    let { sum, stdev } = values.reduce(statistics)

    if (key === 'total-byte-weight') {
      sum = sum / 1024
      stdev = stdev / 1024
    }

    /* Take average of all values */
    let numberOfDecimals = 2
    if (key === 'speed-index-metric') numberOfDecimals = 0

    const average = (sum / results.length).toFixed(numberOfDecimals)

    let color
    if (average < threshold) color = green
    else {
      color = red
      error = true
    }

    const row = [
      color(property),
      color(average + ' ' + units(key)),
      color(threshold + ' ' + units(key))
    ]
    if (store.enabled) {
      let value = ''
      if (master[key]) value = master[key] + ' ' + units(key)
      row.splice(2, 0, color(value))
    }

    table.push(row)

    /* if average crosses threshold by standard deviation, throw a warning */
    if (average > threshold && average - stdev < threshold)
      unreliableResults.push(`${property}: ${stdev.toFixed(2)} ${units(key)}`)
  }

  console.log(table.toString())
  console.log()

  /* warnings for unreliable results due to variation */
  if (unreliableResults.length) {
    console.log(
      yellow('The following results are not reliable due to high variations:')
    )
    console.log()
    console.log(unreliableResults.join('\n'))
    console.log()
  }

  /* Check travis branch */
  console.log(process.env.TRAVIS_BRANCH)

  /* error build if average > threshold */
  if (error && fail) build.fail(values)
  else build.pass(values)
}

module.exports = { print }
