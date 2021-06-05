import config from "../../code-review-leaderboard.config";

export const setMockConfig = (): void => {
    config.startDate = new Date("2021-04-26");
    config.endDate = new Date("2021-05-07");

    config.azure.enabled = true;
    config.azure.baseURL = "https://dev.azure.com/MyOrg";
    config.azure.personalAccessToken = "abc123";

    config.gitlab.enabled = true;
    config.gitlab.baseURL = "https://gitlab.example.com/";
    config.gitlab.personalAccessToken = "abc123";

    config.httpTimeoutInMS = 5000;
};
