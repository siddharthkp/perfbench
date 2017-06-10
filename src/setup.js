const seleniumAssistant = require('selenium-assistant')
const syncExec = require('sync-exec')
const path = require('path')

const setup = () => {
  return new Promise(resolve => {
    process.env.DISPLAY = ':99.0'
    const output = syncExec('sh -e /etc/init.d/xvfb start')
    seleniumAssistant
      .downloadLocalBrowser('chrome', 'stable')
      .then(() => resolve())
  })
}

module.exports = setup
