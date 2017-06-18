const axios = require('axios')
const url = 'https://perfbench-store.now.sh/values'
const { repo, token } = require('./travis')

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

const set = values => {
  if (repo && token) {
    axios.post(url, { repo, token, values }).catch(error => console.log(error))
  }
}

const store = { enabled, set, get }
module.exports = store
