const Build = require('github-build')

const data = {
  repo: process.env.TRAVIS_REPO_SLUG,
  sha: process.env.TRAVIS_PULL_REQUEST_SHA,
  token: process.env.github_token,
  label: 'perfbench',
  description: 'Running performance tests'
}
console.log(data)

const build = new Build(data)

let pass = () => {} // noop
let fail = () => process.exit(1)

/* If github token is given and we have commit sha */
if (process.env.github_token && process.env.TRAVIS_PULL_REQUEST_SHA) {
  build.start()
  pass = () => build.pass('Performance check passed 🚀')
  fail = () => build.fail('Performance check failed')
}

module.exports = { pass, fail }
