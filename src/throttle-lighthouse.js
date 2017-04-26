const fs = require('fs')
const path = './node_modules/lighthouse/lighthouse-core/lib/emulation.js'

module.exports = () => {
  const emulation = fs.readFileSync(path, 'utf8')

  const custom = emulation.replace(
    'downloadThroughput: Math.floor(1.6 * 1024 * 1024 / 8), // 1.6Mbps',
    'downloadThroughput: Math.floor(750 * 1024 / 8), // 750Kbps Custom'
  )

  fs.writeFileSync(path, custom)
}
