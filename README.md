# code-review-leaderboard

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
