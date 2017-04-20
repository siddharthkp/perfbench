const lighthouse = require("./lighthouse");
const reporter = require("./reporter");

const WAIT_BETWEEN_RUNS = 2500;
const NUMBER_OF_RUNS = 3;

const url = process.argv[2];

const results = [];

const run = () => {
  runs = runs - 1;
  lighthouse
    .run(url)
    .then(result => {
      results.push(result);
      if (runs > 0) setTimeout(run, WAIT_BETWEEN_RUNS);
      else reporter.print(results);
    })
    .catch(err => {
      throw err;
    });
};

let runs = 3;
lighthouse.throttle();
run();
