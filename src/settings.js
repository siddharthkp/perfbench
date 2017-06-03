const argv = require('yargs-parser')(process.argv.slice(2))

const settings = {
  runs: argv.runs || 3,
  url: process.argv[2]
}

module.exports = settings
