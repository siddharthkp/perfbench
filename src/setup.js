const syncExec = require('sync-exec')
const seleniumAssistant = require('selenium-assistant')
const path = require('path')
const spawn = require('child_process').spawn

process.env.DISPLAY = ':99.0'

class LighthouseWrapper {
  downloadChrome() {
    console.log('Downloading chrome')
    return seleniumAssistant
      .downloadLocalBrowser('chrome', 'stable', 24 * 7)
      .then(() => {
        console.log('Download finished.')
      })
  }

  startChrome() {
    console.log('starting chrome')
    if (this._chromeProcess) {
      return Promise.resolve()
    }

    const tmpDir = this._unixTmpDir()
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

  killChrome() {
    if (!this._chromeProcess) {
      return Promise.resolve()
    }

    this._chromeProcess.kill('SIGHUP')
    this._chromeProcess = null

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  }

  _unixTmpDir() {
    return syncExec('mktemp -d -t lighthouse.XXXXXXX').toString().trim()
  }
}

const wrapper = new LighthouseWrapper()

const setup = () => {
  return new Promise((resolve, reject) => {
    const output = syncExec('sh -e /etc/init.d/xvfb start')
    if (output.stderr) {
      console.log(output.stderr)
      process.exit(1)
    }

    wrapper
      .downloadChrome()
      .then(() => wrapper.startChrome())
      .then(() => resolve())
      .catch(error => reject(error))
  })
}

module.exports = setup
