# code-review-leaderboard

[![Build Status](https://dev.azure.com/lachiejames/code-review-leaderboard/_apis/build/status/lachiejames.code-review-leaderboard?branchName=main)](https://dev.azure.com/lachiejames/code-review-leaderboard/_build/latest?definitionId=12&branchName=main) [![codecov](https://codecov.io/gh/lachiejames/code-review-leaderboard/branch/main/graph/badge.svg?token=kNLA2ldKKF)](https://codecov.io/gh/lachiejames/code-review-leaderboard) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Setting up your configuration

Open `code-review-leaderboard.config.js` from the root directory, and populate the following options:

| Property                   | Description                                     | Example                           |
| -------------------------- | ----------------------------------------------- | --------------------------------- |
| startDate                  | Include pull requests updated after this date   | Date("2021-05-01")                |
| endDate                    | Include pull requests updated before this date  | Date("2021-05-07")                |
| azure.enabled              | Include pull requests from Azure                | true                              |
| azure.baseURL              | The Azure home page for your organisation       | `"https://dev.azure.com/Example"` |
| azure.personalAccessToken  | Authenticates HTTP requests to Azure            | "3Ccz4G6QPilk"                    |
| gitlab.enabled             | Include pull requests from Gitlab               | false                             |
| gitlab.baseURL             | The Gitlab home page for your organisation      | `"https://gitlab.example.com/"`   |
| gitlab.personalAccessToken | Authenticates HTTP requests to Gitlab           | "Hf4sXcfn7M69"                    |
| httpTimeoutInMS            | Max time to wait for a HTTP request to complete | 5000                              |

## Running locally

Install dependencies:

```
yarn
```

Running tests:

```
yarn test
```

Building and running:

```
yarn start
```
