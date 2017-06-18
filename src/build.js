const Build = require('github-build')
let { thresholds } = require('./settings')
const { repo, sha, token } = require('./travis')

const label = 'perfbench'
const message = 'Running performance tests...'
const meta = { repo, sha, token, label, message }

const build = new Build(meta)

let pass = () => {} // noop
let fail = () => process.exit(1)

/* If github token is given and we have commit sha */
if (token && sha) {
  build.start()
  pass = values => build.pass('Performance checks passed!')
  fail = values => build.fail('Performance checks failed!')
}

module.exports = { pass, fail }
