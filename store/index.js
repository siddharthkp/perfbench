const express = require('express')
const server = express()
const lowercase = require('lodash.lowercase')
const bodyParser = require('body-parser')
const querystring = require('querystring')
const { get, set } = require('./firebase')
const github = require('./github')

server.use(bodyParser.json())
server.set('view engine', 'pug')
server.use(express.static('static'))

server.get('/status', (req, res) => {
  res.status(200).end('OK')
})

server.get('/values', (req, res) => {
  const { repo, token } = req.query
  if (!repo) res.status(400).end('repo missing')
  else if (!token) res.status(401).end('token missing')
  else {
    get(repo, token).then(response => {
      /* Firebase returns a list */
      const values = Object.values(response)[0]
      res.end(JSON.stringify(values))
    })
  }
})

server.post('/values', (req, res) => {
  const { repo, sha, values, token } = req.body
  if (!token) res.status(401).end('token missing')
  else {
    set(repo, sha, values, token)
    res.status(200).end()
  }
})

server.get('/auth', (req, res) => {
  const { code } = req.query
  if (!code) res.status(400).end('code missing')
  else
    github
      .token(code)
      .then(response => {
        const token = querystring.parse(response).access_token
        res.render('auth', { token })
      })
      .catch(() => res.status(500).end('Oops'))
})

server.get('/build', (req, res) => {
  let { info } = req.query
  info = JSON.parse(info)

  const data = {
    repo: info.repo,
    branch: info.branch,
    sha: info.sha.slice(0, 8),
    commit_message: info.commit_message || '',
    metrics: []
  }

  const keys = Object.keys(info.averageValues)
  keys.map(key => {
    const name = lowercase(key)
    const value = info.averageValues[key]
    const threshold = info.thresholds[key]

    const values = { name, value, threshold }

    if (key != 'speed-index-metric') values.unit = 'ms'

    if (info.master && info.master[key]) {
      let diff = (value - info.master[key]).toFixed(0)
      if (diff >= 0) diff = `+${diff}`
      values.diff = diff
    }

    /* Logic to draw bars */
    values.maxLength = Math.max(value, threshold)
    if (value < values.maxLength) {
      values.fillLength = value
      values.baseColor = '#EEE'
    } else {
      values.fillLength = threshold
      values.baseColor = '#FA5E7C'
      values.class = 'fail'
    }

    data.metrics.push(values)
  })

  res.render('build', data)
})

server.get('/', (req, res) => {
  res.redirect('/status')
})

server.listen(3001)
