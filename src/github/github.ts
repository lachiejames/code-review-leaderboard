import { inConfigDateRange } from "../shared/config-verifier";
import { PullRequest } from "../shared/pull-request.model";
import { logNoteCount } from "../shared/shared-logger";

import { fetchAllGithubPullRequestsForProject, fetchGithubRepositoryData, fetchPullRequestNotes } from "./github-data-gatherer";
import { parseGithubPullRequestData, parseGithubPullRequestNoteData } from "./github-data-parser";
import {
    logPullRequestFetchingProgress,
    logPullRequestNoteFetchingProgress,
    logRepositoryFetchingCompletion,
    logRepositoryFetchingStart,
} from "./github-logger";
import { GithubPullRequest, GithubPullRequestNote, GithubRepository } from "./github-models";

export const getGithubPullRequests = async (): Promise<PullRequest[]> => {
    logRepositoryFetchingStart();

    const repositoryData: GithubRepository[] = await fetchGithubRepositoryData();
    let allPullRequests: PullRequest[] = [];

    logRepositoryFetchingCompletion(repositoryData.length);

    for (let repoIndex = 0; repoIndex < repositoryData.length; repoIndex++) {
        const pullRequestsData: GithubPullRequest[] = await fetchAllGithubPullRequestsForProject(repositoryData[repoIndex].name);
        const validPullRequestsData = pullRequestsData.filter((pr: GithubPullRequest) => inConfigDateRange(pr.updated_at));
        const pullRequests: PullRequest[] = parseGithubPullRequestData(validPullRequestsData);

        logPullRequestFetchingProgress(repoIndex, repositoryData.length, pullRequests.length);

        for (let prIndex = 0; prIndex < pullRequests.length; prIndex++) {
            logPullRequestNoteFetchingProgress(repoIndex, repositoryData.length, prIndex, pullRequests.length);

            const threads: GithubPullRequestNote[] = await fetchPullRequestNotes(
                repositoryData[repoIndex].name,
                validPullRequestsData[prIndex].number,
            );
            const validThreads = threads.filter((pr: GithubPullRequestNote) => inConfigDateRange(pr.submitted_at));

            pullRequests[prIndex].notes = parseGithubPullRequestNoteData(validThreads);
        }

        allPullRequests = allPullRequests.concat(pullRequests);
    }

    logNoteCount(allPullRequests);

    return allPullRequests;
};
