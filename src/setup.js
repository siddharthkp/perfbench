const seleniumAssistant = require('selenium-assistant')
const syncExec = require('sync-exec')
const path = require('path')

const setup = () => {
  console.log(1)
  process.env.DISPLAY = ':99.0'
  console.log(2)
  const output = syncExec('sh -e /etc/init.d/xvfb start')
  console.log(3)
  return seleniumAssistant.downloadLocalBrowser('chrome', 'stable')
}

module.exports = setup
