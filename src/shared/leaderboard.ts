import config from "../../code-review-leaderboard.config";
import { getAzurePullRequests } from "../azure/azure";
import { getGitlabPullRequests } from "../gitlab/gitlab";
import { calculateResults, createResultsTable, logResults, sortResults } from "../shared/result-calculator";
import { Result } from "../shared/result.model";

import { verifyConfig } from "./config-verifier";
import { PullRequest } from "./pull-request.model";
import { logError } from "./shared-logger";

export const getAllPullRequestData = async (): Promise<PullRequest[]> => {
    let pullRequests: PullRequest[] = [];

    if (config.gitlab.enabled) {
        const gitlabPullRequests: PullRequest[] = await getGitlabPullRequests();
        pullRequests = pullRequests.concat(gitlabPullRequests);
    }

    if (config.azure.enabled) {
        const azurePullRequests: PullRequest[] = await getAzurePullRequests();
        pullRequests = pullRequests.concat(azurePullRequests);
    }

    return pullRequests;
};

export const calculateAndShowLeaderboard = (pullRequests: PullRequest[]): void => {
    const results: Result[] = calculateResults(pullRequests);
    const sortedResults: Result[] = sortResults(results);
    const tableResults: (number | string)[][] = createResultsTable(sortedResults);
    logResults(tableResults);
};

export const run = async (): Promise<void> => {
    try {
        verifyConfig();

        const pullRequests: PullRequest[] = await getAllPullRequestData();
        calculateAndShowLeaderboard(pullRequests);
    } catch (error) {
        logError(error);
    }
};
