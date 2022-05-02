module.exports = {
    // Only allow merge requests created/updated after this date
    startDate: new Date("2022-04-18"),

    // Only allow merge requests created/updated before this date
    endDate: new Date("2022-05-01"),

    // Azure-specific options
    azure: {
        // Controls whether Azure pull requests are included in the leaderboard
        enabled: true,

        // The home page for your organisation's gitlab
        baseUrl: "",

        // Authenticates http requests during lookups
        personalAccessToken: "",
    },

    // Github-specific options
    github: {
        // Controls whether Github pull requests are included in the leaderboard
        enabled: true,

        // The home page for your organisation's Github
        baseUrl: "",

        // Authenticates http requests during lookups
        personalAccessToken: "",
    },

    // Gitlab-specific options
    gitlab: {
        // Controls whether Gitlab pull requests are included in the leaderboard
        enabled: true,

        // The home page for your organisation's gitlab
        baseUrl: "",

        // Authenticates http requests during lookups
        personalAccessToken: "",
    },

    // Max amount of time to wait for a single HTTP request response, in milliseconds
    httpTimeoutInMS: 5000,
};
