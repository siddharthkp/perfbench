const syncExec = require('sync-exec')

syncExec('npm install', { stdio: [0, 1, 2] })
syncExec('npm link ../', { stdio: [0, 1, 2] })
syncExec('./node_modules/.bin/perfbench', { stdio: [0, 1, 2] })
