# code-review-leaderboard

[![Build Status](https://dev.azure.com/lachiejames/code-review-leaderboard/_apis/build/status/lachiejames.code-review-leaderboard?branchName=main)](https://dev.azure.com/lachiejames/code-review-leaderboard/_build/latest?definitionId=12&branchName=main) [![codecov](https://codecov.io/gh/lachiejames/code-review-leaderboard/branch/main/graph/badge.svg?token=kNLA2ldKKF)](https://codecov.io/gh/lachiejames/code-review-leaderboard) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Running from the command line

### Installing

Install `code-review-leaderboard` globally using npm:

```
npm install -g code-review-leaderboard
```

### Setting up your configuration and running locally

You can set up your configuration from the command line using:

```
code-review-leaderboard
```

It will then fetch the pull request data from the selected organisations, using the provided credentials. If successful, it will print out a leaderboard that looks like this:

![Example results](https://github.com/lachiejames/media-host/blob/main/code-review-leaderboard/example-results.png?raw=true)

### Demo

![Video demo](https://github.com/lachiejames/media-host/blob/main/code-review-leaderboard/demo.gif?raw=true)

## Running in TypeScript

### Installing

Install the project using:

```
git clone https://github.com/lachiejames/code-review-leaderboard.git
```

### Setting up your configuration

Open `code-review-leaderboard.config.js` from the root directory, and populate the following options:

| Property                   | Description                                     | Example                           |
| -------------------------- | ----------------------------------------------- | --------------------------------- |
| startDate                  | Include pull requests updated after this date   | Date("2021-05-01")                |
| endDate                    | Include pull requests updated before this date  | Date("2021-05-07")                |
| azure.enabled              | Include pull requests from Azure                | true                              |
| azure.baseUrl              | The Azure home page for your organisation       | `"https://dev.azure.com/Example"` |
| azure.personalAccessToken  | Authenticates HTTP requests to Azure            | "3Ccz4G6QPilk"                    |
| gitlab.enabled             | Include pull requests from Gitlab               | false                             |
| gitlab.baseUrl             | The Gitlab home page for your organisation      | `"https://gitlab.example.com/"`   |
| gitlab.personalAccessToken | Authenticates HTTP requests to Gitlab           | "Hf4sXcfn7M69"                    |
| httpTimeoutInMS            | Max time to wait for a HTTP request to complete | 5000                              |

### Running locally

Installing dependencies:

```
yarn
```

Compiling to JavaScript:

```
yarn build
```

Running with Node:

```
yarn start
```

Running tests:

```
yarn test
```

### More info

Check out this blog post that describes `code-review-leaderboard` in further detail:
https://lachiejames.com/spice-up-code-reviews-at-your-organisation-with-a-leaderboard/
