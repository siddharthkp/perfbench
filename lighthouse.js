const lighthouse = require("lighthouse");
const chrome = require("lighthouse/lighthouse-cli/chrome-launcher.js")
  .ChromeLauncher;
const throttle = require("./throttle-lighthouse");

const config = require("./config.json");
const flags = { disableCpuThrottling: false };

const run = url =>
  new Promise((resolve, reject) => {
    const launcher = new chrome({ port: 9222, autoSelectChrome: true });

    return launcher
      .isDebuggerReady()
      .catch(() => launcher.run()) // Launch Chrome
      .then(() => lighthouse(url, flags, config)) // Run Lighthouse
      .then(results => launcher.kill().then(() => results)) // Kill Chrome and return results
      .then(results => {
        results.artifacts = undefined; // Disable artifacts
        resolve(results);
      })
      .catch(err => launcher.kill().then(() => reject(err))); // Kill Chrome if there's an error.
  });

module.exports = { run, throttle };
