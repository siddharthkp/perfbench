const axios = require('axios')
const url = 'https://perfbench-store.now.sh/values'

const repo = process.env.TRAVIS_REPO_SLUG
const token = process.env.github_token

let enabled = false
let values = {}

if (repo && token) {
  enabled = true
  axios
    .get(`${url}?repo=${repo}&token=${token}`)
    .then(response => (values = response.data))
    .catch(error => console.log(error))
}

const get = () => values

const set = values => {}

const store = { enabled, set, get }
module.exports = store
