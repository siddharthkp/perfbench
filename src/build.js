const Build = require('github-build')

const data = {
  repo: process.env.TRAVIS_REPO_SLUG,
  sha: process.env.TRAVIS_PULL_REQUEST_SHA,
  token: process.env.github_token,
  label: 'perfbench',
  description: 'Performance benchmarking'
}
console.log(data)

const build = new Build(data)
console.log(build)

let pass = () => {} // noop
let fail = () => process.exit(1)

/* If github token is given */
if (process.env.github_token) {
  console.log('enhancing pass + fail')
  build.start()
  pass = () => build.pass()
  fail = () => build.fail()
}

console.log(pass)

module.exports = { pass, fail }
