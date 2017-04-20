const fs = require("fs");

const run = () =>
  new Promise(resolve => {
    const results = fs.readFileSync("./results.json", "utf8");
    resolve(JSON.parse(results));
  });

module.exports = { run };
