const syncExec = require('sync-exec')

const commands = [
  'export DISPLAY=:99.0',
  'export LIGHTHOUSE_CHROMIUM_PATH="$(pwd)/chrome-linux/chrome"',
  'sh -e /etc/init.d/xvfb start',
  './node_modules/lighthouse/lighthouse-core/scripts/download-chrome.sh'
]

const setup = () => {
  console.log('Setting up Chrome')
  for (let command of commands) {
    const output = syncExec(command)
    if (output.stderr) throw new Error(output.stderr)
  }
}

module.exports = setup
