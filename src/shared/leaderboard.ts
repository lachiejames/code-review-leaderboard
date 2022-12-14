import { getAzurePullRequestsAndCommitsAndPushes } from "../azure/azure";
import { getConfig } from "../config";
import { getGithubPullRequests } from "../github/github";
import { getGitlabPullRequests } from "../gitlab/gitlab";
import { calculateResults, createResultsTable, logResults, sortResults } from "../shared/result-calculator";
import { Result } from "../shared/result.model";

import { verifyConfig } from "./config-verifier";
import { PullRequest } from "./pull-request.model";
import { Commit } from "./commit.model";
import { Push } from "./push.model";
import { logError } from "./shared-logger";

export const getAllPullRequestData = async (): Promise<[PullRequest[],Commit[],Push[]]> => {
    let pullRequests: PullRequest[] = [];
	let commits: Commit[] = [];
	let pushes: Push[] = [];

    if (getConfig().gitlab.enabled) {
        const gitlabPullRequests: PullRequest[] = await getGitlabPullRequests();
        pullRequests = pullRequests.concat(gitlabPullRequests);
    }

    if (getConfig().github.enabled) {
        const githubPullRequests: PullRequest[] = await getGithubPullRequests();
        pullRequests = pullRequests.concat(githubPullRequests);
    }

    if (getConfig().azure.enabled) {
        const [azurePullRequests,azureCommits,azurePushes] : [PullRequest[],Commit[],Push[]] = await getAzurePullRequestsAndCommitsAndPushes();
        pullRequests = pullRequests.concat(azurePullRequests);
		commits = commits.concat(azureCommits);		
		pushes = pushes.concat(azurePushes);		
    }

    return [pullRequests,commits,pushes];
};

export const calculateAndShowLeaderboard = (pullRequests: PullRequest[], commits: Commit[], pushes: Push[]): void => {
    const results: Result[] = calculateResults(pullRequests, commits, pushes);
    const sortedResults: Result[] = sortResults(results);
    const tableResults: (number | string)[][] = createResultsTable(sortedResults);
    logResults(tableResults);
};

export const run = async (): Promise<void> => {
    try {
        verifyConfig();

        const [pullRequests,commits,pushes] : [PullRequest[],Commit[],Push[]] = await getAllPullRequestData();
        calculateAndShowLeaderboard(pullRequests,commits,pushes);
    } catch (error) {
        logError(error);
    }
};
