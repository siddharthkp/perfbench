const Build = require('github-build')
const startcase = require('lodash.startcase')
const { thresholds } = require('./settings')
const { units } = require('./properties')
const { repo, sha, token } = require('./travis')
const store = require('./api')

const label = 'perfbench'
const description = 'Running performance tests...'
const meta = { repo, sha, token, label, description }

const build = new Build(meta)

let pass = () => {} // noop
let fail = () => process.exit(1)
let error = () => {} // noop

/* If github token is given and we have commit sha */
if (token && sha) {
  build.start()

  pass = values => {
    /* default message */
    let message = 'Performance checks passed!'

    if (store.enabled) {
      const keys = ['time-to-interactive', 'first-meaningful-paint']
      let properties = []

      const master = store.get()
      /* Check that master is not an empty object */
      if (!Object.keys(master).length) return

      let increased = false

      for (let key of keys) {
        if (values[key] > master[key]) {
          increased = key
          break
        }
      }

      /* If it did not increase, must have improved */
      const key = increased || keys[0]
      const starter = increased ? 'Warning:' : 'Good job!'
      const verb = increased ? 'increased' : 'improved'
      const difference = Math.round(Math.abs(values[key] - master[key]))

      message = `${starter} ${startcase(key)} has ${verb} by ${difference} ${units(key)}`
    }

    build.pass(message)
  }

  fail = values => {
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

    build.fail(message)
  }

  error = () => build.error()
}

module.exports = { pass, fail, error }
