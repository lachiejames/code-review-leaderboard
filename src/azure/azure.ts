import { inConfigDateRange } from "../shared/config-verifier";
import { PullRequest } from "../shared/pull-request.model";
import { logNoteCount } from "../shared/shared-logger";

import { fetchAzurePullRequestsByProject, fetchAzureRepositoryData, fetchPullRequestNotes } from "./azure-data-gatherer";
import { parseAzurePullRequestData, parseAzurePullRequestNoteData } from "./azure-data-parser";
import {
    logPullRequestFetchingProgress,
    logPullRequestNoteFetchingProgress,
    logRepositoryFetchingCompletion,
    logRepositoryFetchingStart,
} from "./azure-logger";
import { AzurePullRequest, AzurePullRequestNote, AzureRepository } from "./azure-models";

export const getAzurePullRequests = async (): Promise<PullRequest[]> => {
    logRepositoryFetchingStart();

    const repositoryData: AzureRepository[] = await fetchAzureRepositoryData();
    let allPullRequests: PullRequest[] = [];

    logRepositoryFetchingCompletion(repositoryData.length);

    for (let repoIndex = 0; repoIndex < repositoryData.length; repoIndex++) {
        const pullRequestsData: AzurePullRequest[] = await fetchAzurePullRequestsByProject(repositoryData[repoIndex].name);
        const validPullRequestsData = pullRequestsData.filter((pr: AzurePullRequest) => inConfigDateRange(pr.creationDate));
        const pullRequests: PullRequest[] = parseAzurePullRequestData(validPullRequestsData);

        logPullRequestFetchingProgress(repoIndex, repositoryData.length, pullRequests.length);

        for (let prIndex = 0; prIndex < pullRequests.length; prIndex++) {
            logPullRequestNoteFetchingProgress(repoIndex, repositoryData.length, prIndex, pullRequests.length);

            const threads: AzurePullRequestNote[] = await fetchPullRequestNotes(
                repositoryData[repoIndex].name,
                validPullRequestsData[prIndex].pullRequestId,
            );
            const validThreads = threads.filter((pr: AzurePullRequestNote) => inConfigDateRange(pr.lastUpdatedDate));

            pullRequests[prIndex].notes = parseAzurePullRequestNoteData(validThreads);
        }

        allPullRequests = allPullRequests.concat(pullRequests);
    }

    logNoteCount(allPullRequests);

    return allPullRequests;
};
