import { format, isBefore } from "date-fns";

import { getConfig } from "../config";

const verifyAzureConfig = (): void => {
    if (getConfig().azure.baseUrl === "") {
        throw Error(`Azure pull requests are enabled, but you have not set a base URL`);
    }

    if (getConfig().azure.personalAccessToken === "") {
        throw Error(`Azure pull requests are enabled, but you have not set a personal access token`);
    }
};

const verifyGithubConfig = (): void => {
    if (getConfig().github.personalAccessToken === "") {
        throw Error(`Github pull requests are enabled, but you have not set a personal access token`);
    }

    if (getConfig().github.baseUrl === "") {
        throw Error(`Github pull requests are enabled, but you have not set a base URL`);
    }
};

const verifyGitlabConfig = (): void => {
    if (getConfig().gitlab.personalAccessToken === "") {
        throw Error(`Gitlab pull requests are enabled, but you have not set a personal access token`);
    }

    if (getConfig().gitlab.baseUrl === "") {
        throw Error(`Gitlab pull requests are enabled, but you have not set a base URL`);
    }
};

const verifyDateRange = (): void => {
    if (isBefore(getConfig().endDate, getConfig().startDate)) {
        const startDateString: string = format(getConfig().startDate, "dd/MM/yyyy");
        const endDateString: string = format(getConfig().endDate, "dd/MM/yyyy");
        throw Error(`endDate (${endDateString}) cannot be earlier than startDate (${startDateString})`);
    }
};

export const verifyConfig = (): void => {
    verifyDateRange();

    if (getConfig().azure.enabled) {
        verifyAzureConfig();
    }

    if (getConfig().github.enabled) {
        verifyGithubConfig();
    }

    if (getConfig().gitlab.enabled) {
        verifyGitlabConfig();
    }
};
