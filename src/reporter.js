const fs = require('fs')
const Table = require('cli-table2')
const { white, yellow, green, red } = require('colors/safe')
const statistics = require('statistics')
const kebabcase = require('lodash.kebabcase')

const { optimalValues, units } = require('./properties')
let { debug, fail, thresholdSettings } = require('./settings')

/* Table headers */
let table = new Table({
  head: [white('Property'), white('Average'), white('Threshold')]
})

let error = false
let unreliableResults = []

const print = results => {
  if (debug) fs.writeFileSync('./debug.json', JSON.stringify(results, null, 2))

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

  /* Merge defaults and settings to get thresholds */
  let thresholds = Object.assign({}, optimalValues, ...thresholdSettings)
  if (debug) console.log('thresholds: ', thresholds)

  for (let key of keys) {
    const property = results[0].audits[key].description
    const threshold = thresholds[key] || 0

    let values = []

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

    table.push([
      color(property),
      color(average + ' ' + units(key)),
      color(threshold + ' ' + units(key))
    ])

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

  /* error build if average > threshold */
  if (error && fail) process.exit(1)
}

module.exports = { print }
