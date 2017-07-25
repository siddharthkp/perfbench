<p align="center">
  <img src="https://raw.githubusercontent.com/siddharthkp/perfbench/master/logo.png" height="200px"/>
  <br><br>
  <b>Continuous integration for performance monitoring</b>
  <br>
</p>

&nbsp;

[![Build Status](https://travis-ci.org/siddharthkp/reaqt.svg?branch=master)](https://travis-ci.org/siddharthkp/perfbench)

&nbsp;

#### minimal setup
```
npm install perfbench --save
```

&nbsp;

#### usage

Add to your `package.json`

```json
"scripts": {
  "test": "perfbench http://localhost:3000"
}
```

#### use with CI

Add this line in your `.travis.yml`

```yaml
scripts:
  - perfbench http://localhost:3000
```

&nbsp;

#### metrics measured

- First meaningful paint (1600 ms threshold)
- Speed index metric (1250)
- Time to interactive (2500 ms)
- Total byte weight (1600 Kb)

&nbsp;

#### test conditions

- Network: Regular 3G (750 Kbps)
- Device emulation: Nexus 5X
- CPU: 5x slowdown

&nbsp;

#### configuration

You can also drop a YAML file `.perf.yml` in the root of your repository for easier customisation.

All fields are optional.

```yaml
runs: 2         # average of how many runs (optional, default: 3)
fail: false     # fail: true only throws a warning (optional, default: true)
thresholds:     # build will fail if these thresholds are not met (optional, defaults:)
  - first-meaningful-paint: 1600
  - speed-index-metric: 1250
  - time-to-interactive: 2500
  - total-byte-weight: 1600
```

&nbsp;

#### custom properties

You can also add custom properties.

Send a user timing performance event from your javascript.
```js
performance.mark('Page ready')
```

And add the kebabcased key to `.perf.yml`

```yaml
thresholds:
  - page-ready: 1500
```

##### event-type

For travis users, if you would like to run perfbench in `pull_request` instead of `push`,
set `event-type` in `.perf.yml`

```yaml
event-type: pull_request
```

&nbsp;

#### like it?

:star: this repo

&nbsp;

#### todo

- support multiple urls

&nbsp;

#### license

MIT © [siddharthkp](https://github.com/siddharthkp)
