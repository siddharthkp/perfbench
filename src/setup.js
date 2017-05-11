const syncExec = require('sync-exec')

process.env.DISPLAY = ':99.0'
process.env.LIGHTHOUSE_CHROMIUM_PATH = `${process.cwd()}/chrome-linux/chrome`

const commands = [
  'date',
  'sh -e /etc/init.d/xvfb start',
  'date',
  './node_modules/lighthouse/lighthouse-core/scripts/download-chrome.sh',
  'date',
  'ls'
]

const setup = () => {
  console.log('Setting up Chrome')
  for (let command of commands) {
    const output = syncExec(command, { stdio: [0, 1, 2] })
    if (output.stderr) {
      console.log(output.stderr)
      process.exit(1)
    }
  }
}

module.exports = setup
