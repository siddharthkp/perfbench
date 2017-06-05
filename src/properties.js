const optimalValues = {
  'first-meaningful-paint': 1600,
  'speed-index-metric': 1250,
  'time-to-interactive': 2500,
  'total-byte-weight': 1600
}

const units = property => {
  return (
    {
      'first-meaningful-paint': 'ms',
      'speed-index-metric': '',
      'time-to-interactive': 'ms',
      'total-byte-weight': 'Kb'
    }[property] || 'ms'
  )
}

module.exports = { optimalValues, units }
