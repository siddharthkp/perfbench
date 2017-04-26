const fs = require("fs");
const Table = require("cli-table2");
const { white, yellow, green, red } = require("colors/safe");
const { optimalValues, units } = require("./properties");

let table = new Table({
  head: [white("Property"), white("Average"), white("Optimal")]
});

const print = results => {
  if (process.env.debug)
    fs.writeFileSync("./results.json", JSON.stringify(results, null, 2));

  console.log("Test conditions:");
  console.log();
  const conditions = results[0].runtimeConfig.environment;
  for (let condition of conditions) {
    if (condition.enabled)
      console.log(yellow(condition.name), yellow(condition.description));
  }
  console.log();

  const keys = Object.keys(results[0].audits);

  let fail = false;

  for (let key of keys) {
    const property = results[0].audits[key].description;
    const optimal = optimalValues[key];

    let sum = 0;

    for (let i = 0; i < results.length; i++) {
      const data = results[i].audits[key];
      sum += data.rawValue;
    }

    if (key === "total-byte-weight") sum = sum / 1024;

    const value = (sum / results.length).toFixed(2);

    let color;
    if (value < optimal) color = green;
    else {
      color = red;
      fail = true;
    }

    table.push([
      color(property),
      color(value + " " + units[key]),
      color(optimal + " " + units[key])
    ]);
  }

  //if (key === 'user-timings') console.log(result.extendedInfo)
  console.log(table.toString());

  if (fail) process.exit(1);
};

module.exports = { print };
