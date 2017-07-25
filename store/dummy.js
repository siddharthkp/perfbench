const params = {
  averageValues: {
    'first-meaningful-paint': '955',
    'time-to-interactive': '1251',
    'speed-index-metric': '610',
    'search-ready': '2700'
  },
  master: {
    'first-meaningful-paint': '955',
    'speed-index-metric': '586',
    'time-to-interactive': '610',
    'search-ready': '2305'
  },
  thresholds: {
    'first-meaningful-paint': 1600,
    'speed-index-metric': 1250,
    'time-to-interactive': 1700,
    'search-ready': '2500'
  },
  repo: 'practo/medicine-info',
  branch: 'awesome-feature',
  commit_message: 'Add super awesome feature',
  sha: 'da87b46702da847ad80f18c04408cf931c318b2d'
}

const stuff =
  'http://localhost:3001/build?info=' +
  encodeURIComponent(JSON.stringify(params))
console.log(stuff)
