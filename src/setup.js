const seleniumAssistant = require('selenium-assistant')
const syncExec = require('sync-exec')
const path = require('path')
const spawn = require('child_process').spawn
const execSync = require('child_process').execSync

process.env.DISPLAY = ':99.0'

const downloadChrome = () => {
  console.log('Starting download.')
  return seleniumAssistant
    .downloadLocalBrowser('chrome', 'stable', 24 * 7)
    .then(() => {
      console.log('Download finished.')
    })
}

const startChrome = () => {
  console.log('starting chrome')
  if (this._chromeProcess) {
    return Promise.resolve()
  }

  const _unixTmpDir = () => {
    return execSync('mktemp -d -t lighthouse.XXXXXXX').toString().trim()
  }

  const tmpDir = _unixTmpDir()

  const args = [
    `--remote-debugging-port=${9222}`,
    '--disable-extensions',
    '--disable-translate',
    '--disable-default-apps',
    '--no-first-run',
    `--user-data-dir=${tmpDir}`
  ]
  this._chromeProcess = spawn(
    path.join(
      seleniumAssistant.getBrowserInstallDir(),
      '/chrome/stable/usr/bin/google-chrome-stable'
    ),
    args
  )

  // Wait for Chrome to be usable
  return new Promise(resolve => {
    console.log('waiting for chrome to be usable')
    setTimeout(resolve, 10000)
  })
}

const setup = () => {
  return new Promise((resolve, reject) => {
    const command = 'sh -e /etc/init.d/xvfb start'
    const output = syncExec(command)
    if (output.stderr) {
      console.log(output.stderr)
      process.exit(1)
    }
    downloadChrome().then(() => resolve())
  })
}

module.exports = setup
