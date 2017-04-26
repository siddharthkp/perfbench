const syncExec = require("sync-exec");
const throttle = require("./throttle-lighthouse");

const config = require("./config.json");
const flags = { disableCpuThrottling: false };

const run = url =>
  new Promise((resolve, reject) => {
    const command = [
      "./node_modules/.bin/lighthouse",
      url,
      "--output=json",
      "--disable-cpu-throttling=false",
      "--config-path=./node_modules/perfbench/src/config.json"
    ].join(" ");

    const output = syncExec(command);

    if (output.stderr) reject(output.stderr);
    else resolve(JSON.parse(output.stdout));
  });

module.exports = { run, throttle };
