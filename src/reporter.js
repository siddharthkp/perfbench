const fs = require('fs')
const Table = require('cli-table2')
const { white, yellow, green, red } = require('colors/safe')
const { optimalValues, units } = require('./properties')
let { debug, fail, thresholdSettings } = require('./settings')
const statistics = require('statistics')

let table = new Table({
  head: [white('Property'), white('Average'), white('Threshold')]
})

const print = results => {
  if (debug)
    fs.writeFileSync('./results.json', JSON.stringify(results, null, 2))

  console.log('Test conditions:')
  console.log()
  const conditions = results[0].runtimeConfig.environment
  for (let condition of conditions) {
    if (condition.enabled)
      console.log(yellow(condition.name), yellow(condition.description))
  }
  console.log()

  const keys = Object.keys(results[0].audits)

  let error = false
  let unreliableResults = []

  let thresholds = Object.assign({}, optimalValues, ...thresholdSettings)

  for (let key of keys) {
    const property = results[0].audits[key].description
    const threshold = thresholds[key]

    if (debug) console.log(property, threshold)

    let values = []

    for (let i = 0; i < results.length; i++) {
      if (debug) console.log(results[i].audits[key].rawValue)
      values.push(results[i].audits[key].rawValue)
    }

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
      color(average + ' ' + units[key]),
      color(threshold + ' ' + units[key])
    ])

    /* if average crosses threshold by standard deviation, throw a warning */
    if (average > threshold && average - stdev < threshold)
      unreliableResults.push(`${property}: ${stdev.toFixed(2)} ${units[key]}`)
  }

  // if (key === 'user-timings') console.log(result.extendedInfo)
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
