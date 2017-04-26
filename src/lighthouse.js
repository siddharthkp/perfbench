const syncExec = require("sync-exec");
const throttle = require("./throttle-lighthouse");

const flags = { disableCpuThrottling: false };

let configPath = "./node_modules/perfbench/src/config.json";
if (process.env.test) configPath = "./src/config.json";

const run = url =>
  new Promise((resolve, reject) => {
    const command = [
      "./node_modules/.bin/lighthouse",
      url,
      "--output=json",
      "--disable-cpu-throttling=false",
      "--config-path=" + configPath
    ].join(" ");

    const output = syncExec(command);

    if (output.stderr) reject(output.stderr);
    else resolve(JSON.parse(output.stdout));
  });

module.exports = { run, throttle };
