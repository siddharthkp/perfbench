const syncExec = require('sync-exec')

process.env.DISPLAY = ':99.0'
process.env.LIGHTHOUSE_CHROMIUM_PATH = `${process.cwd()}/chrome-linux/chrome`

const commands = [
  'sh -e /etc/init.d/xvfb start',
  'time ./node_modules/lighthouse/lighthouse-core/scripts/download-chrome.sh'
]

const setup = () => {
  console.log('Setting up Chrome')
  for (let command of commands) {
    const output = syncExec(command)
    if (output.stderr) {
      console.log(output.stderr)
      process.exit(1)
    }
  }
}

module.exports = setup
