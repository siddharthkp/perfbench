const syncExec = require('sync-exec')

process.env.DISPLAY = ':99.0'
process.env.LIGHTHOUSE_CHROMIUM_PATH = `${process.cwd()}/chrome-linux/chrome`

const commands = ['sh -e /etc/init.d/xvfb start', 'sh ./src/download-chrome.sh']

const setup = () => {
  console.log('Setting up Chrome')
  for (let command of commands) {
    const output = syncExec(command)
    console.log(output)
    if (output.stderr) {
      console.log(output.stderr)
      process.exit(1)
    }
  }
}

module.exports = setup
