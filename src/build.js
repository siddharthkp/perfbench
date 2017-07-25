const Build = require('github-build')
const startcase = require('lodash.startcase')
const { repo, sha, event } = require('ci-env')

const { thresholds } = require('./settings')
const { units } = require('./properties')
const token = require('./token')
const store = require('./api')

const label = 'perfbench'
const description = 'Running performance tests...'
const meta = { repo, sha, token, label, description }

const build = new Build(meta)

let pass = () => {} // noop
let fail = () => process.exit(1)
let error = () => process.exit(1)

if (token && event === 'pull_request') {
  build.start()

  pass = values => {
    /* default message */
    let message = 'Good Job! Performance checks passed!'

    if (store.enabled) {
      const master = store.get()
      /* If master values are empty, send default message */
      if (!Object.keys(master).length) build.pass(message)

      const keys = ['time-to-interactive', 'first-meaningful-paint']
      let properties = []
      let increased = false

      for (let key of keys) {
        if (values[key] > parseFloat(master[key])) {
          increased = key
          break
        }
      }

      /* If it did not increase, must have improved */
      const key = increased || keys[0]
      const starter = increased ? 'Warning:' : 'Good job!'
      const verb = increased ? 'increased' : 'improved'
      const difference = Math.round(Math.abs(values[key] - master[key]))

      /*
        Show diff in build if it is at least 100ms,
        anything below that is not reliable
      */
      if (difference >= 100) {
        message = `${starter} ${startcase(key)} has ${verb} by ${difference} ${units(key)}`
      }
    }

    build.pass(message)
  }

  fail = (values, unreliableResults) => {
    let properties = []
    let message

    const keys = Object.keys(values)
    for (key of keys) {
      if (values[key] > thresholds[key]) properties.push(key)
    }

    if (properties.length === 1) {
      const key = properties[0]
      message = `${startcase(key)} is above threshold (${values[key]} > ${thresholds[key]})`
    } else {
      message = `${properties
        .map(p => startcase(p))
        .join(', ')
        .replace(/,([^,]*)$/, ' and$1')} are above threshold`
    }

    if (unreliableResults.length) {
      message = `Results for ${unreliableResults.join(', ')} are not reliable due to high variations`
    }

    build.fail(message)
  }

  error = () => {
    build.error('Tests errored out! Check pull request build for errors')
  }
}

module.exports = { pass, fail, error }
