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
    console.log(command)
    const output = syncExec(command, { stdio: [0, 1, 2] })
    if (output.stderr) {
      console.log(output.stderr)
      process.exit(1)
    }
  }
}

module.exports = setup
