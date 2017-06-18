const Build = require('github-build')
const startcase = require('lodash.startcase')
const { thresholds } = require('./settings')
const { units } = require('./properties')
const { repo, sha, token } = require('./travis')

const label = 'perfbench'
const description = 'Running performance tests...'
const meta = { repo, sha, token, label, description }

const build = new Build(meta)

let pass = () => {} // noop
let fail = () => process.exit(1)

/* If github token is given and we have commit sha */
if (token && sha) {
  build.start()
  pass = values => build.pass('Performance checks passed!')
  fail = values => {
    const properties = []
    let message

    const keys = Object.keys(values)
    for (key of keys) {
      if (values[key] > thresholds[key]) properties.push(key)
    }

    if (properties.length === 1) {
      const key = properties[0]
      message = `${startcase(key)} is above threshold: ${thresholds[key]} ${units(key)}`
    } else {
      message = `${properties
        .map(p => startcase(p))
        .join(', ')
        .replace(/,([^,]*)$/, ' and$1')} are above threshold`
    }

    build.fail(message)
  }
}

module.exports = { pass, fail }
