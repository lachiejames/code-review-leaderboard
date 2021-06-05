module.exports = {
    // Only allow merge requests created/updated after this date
    startDate: new Date("2021-05-01"),

    // Only allow merge requests created/updated before this date
    endDate: new Date("2021-05-07"),

    // Azure-specific options
    azure: {
        // Controls whether Azure pull requests are included in the leaderboard
        enabled: true,

        // The home page for your organisation's gitlab
        baseURL: "",

        // Authenticates http requests during lookups
        personalAccessToken: "",
    },

    // Gitlab-specific options
    gitlab: {
        // Controls whether Gitlab pull requests are included in the leaderboard
        enabled: true,

        // The home page for your organisation's gitlab
        baseURL: "",

        // Authenticates http requests during lookups
        personalAccessToken: "",
    },

    // Max amount of time to wait for a single HTTP request response, in milliseconds
    httpTimeoutInMS: 5000,
};
