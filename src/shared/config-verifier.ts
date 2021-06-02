import { format, isBefore } from "date-fns";

import config from "../../code-review-leaderboard.config";

const verifyAzureConfig = (): void => {
    if (config.azure.baseURL === "") {
        throw Error(`Azure pull requests are enabled, but you have not set a base URL`);
    }

    if (config.azure.personalAccessToken === "") {
        throw Error(`Azure pull requests are enabled, but you have not set a personal access token`);
    }
};

const verifyGitlabConfig = (): void => {
    if (config.gitlab.personalAccessToken === "") {
        throw Error(`Gitlab pull requests are enabled, but you have not set a personal access token`);
    }

    if (config.gitlab.baseURL === "") {
        throw Error(`Gitlab pull requests are enabled, but you have not set a base URL`);
    }
};

const verifyDateRange = (): void => {
    if (isBefore(config.endDate, config.startDate)) {
        const startDateString: string = format(config.startDate, "dd/MM/yyyy");
        const endDateString: string = format(config.endDate, "dd/MM/yyyy");
        throw Error(`endDate (${endDateString}) cannot be earlier than startDate (${startDateString})`);
    }
};

export const verifyConfig = (): void => {
    verifyDateRange();

    if (config.azure.enabled) {
        verifyAzureConfig();
    }

    if (config.gitlab.enabled) {
        verifyGitlabConfig();
    }
};
