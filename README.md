<p align="center">
  <img src="https://raw.githubusercontent.com/siddharthkp/perfbench/master/logo.png" height="200px"/>
  <br><br>
  <b>Continuous integration for performance monitoring</b>
  <br>
</p>

&nbsp;

[![Build Status](https://travis-ci.org/siddharthkp/perfbench.svg?branch=master)](https://travis-ci.org/siddharthkp/perfbench)

&nbsp;

#### install
```
npm install perfbench --save
```

&nbsp;

#### usage

Build and run your application in your CI and then invoke perfbench

`package.json`: 

```json
"name": "my-awesome-app",
"scripts": {
  "pretest": "npm run build && pm2 start server.js",
  "test": "perfbench"
}
```

#### metrics measured

- First meaningful paint
- Speed index metric
- Time to interactive
- Total byte weight

&nbsp;

#### test conditions

- Network: Fast 3G (150ms RTT, 1.6Mbps down, 0.7Mbps up)
- Device emulation: Nexus 5X
- CPU: 5x slowdown

&nbsp;

#### setup

1. configuration 

Drop a YAML file `.perf.yml` in the root of your repository.

```yaml
url: http://localhost:3000            # the url you want to test
fail: false                           # optional, default: true. false will only show a warning
thresholds:                           # all rows are optional. add to customize the threshold
  - first-meaningful-paint: 1600      # optional, default: 1600, value in ms
  - speed-index-metric: 1250          # optional, default: 1250
  - time-to-interactive: 2500         # optional, default: 2500, value in ms
  - total-byte-weight: 1600           # optional, default: 1600, value in Kb
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
set `event-type: pull_request`

```yaml
event-type: pull_request
```

&nbsp;

2) github token for status 

![build status](https://raw.githubusercontent.com/siddharthkp/perfbench/master/build-status.png)

Currently works for [Travis CI](https://travis-ci.org), [CircleCI](https://circleci.com/), [Wercker](wercker.com), and [Drone](http://readme.drone.io/).

- [Authorize `perfbench` for status access](https://github.com/login/oauth/authorize?scope=repo%3Astatus&client_id=5be3b09eacb8977c79e6), copy the generated token.

- Add this token as `PERFBENCH_GITHUB_TOKEN` as environment parameter in your CIs project settings.

(Ask me for help if you're stuck)


#### like it?

:star: this repo

&nbsp;

#### todo

- support multiple urls

&nbsp;

#### license

MIT © [siddharthkp](https://github.com/siddharthkp)
