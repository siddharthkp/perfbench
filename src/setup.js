const seleniumAssistant = require('selenium-assistant')
const syncExec = require('sync-exec')
const path = require('path')

const setup = () => {
  return new Promise((resolve, reject) => {
    process.env.DISPLAY = ':99.0'
    const output = syncExec('sh -e /etc/init.d/xvfb start')
    seleniumAssistant.downloadLocalBrowser('chrome', 'stable')
  })
}

module.exports = setup
