const syncExec = require('sync-exec')

process.env.DISPLAY = ':99.0'
process.env.LIGHTHOUSE_CHROMIUM_PATH = `${process.cwd()}/chrome-linux/chrome`

const commands = [
  'sh -e /etc/init.d/xvfb start',
  './node_modules/lighthouse/lighthouse-core/scripts/download-chrome.sh'
]

const setup = () => {
  console.log('Setting up Chrome')
  console.log(process.env.DISPLAY)
  console.log(process.env.LIGHTHOUSE_CHROMIUM_PATH)
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
