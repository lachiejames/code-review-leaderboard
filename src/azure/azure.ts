import { inConfigDateRange } from "../shared/config-verifier";
import { PullRequest } from "../shared/pull-request.model";
import { Commit } from "../shared/commit.model";
import { Push } from "../shared/push.model";
import { logNoteCount, logCommitCount, logPushCount } from "../shared/shared-logger";

import { fetchAzurePullRequestsByProject, fetchAzureCommitsByProject, fetchAzurePushesByProject, fetchAzureRepositoryData, fetchPullRequestNotes } from "./azure-data-gatherer";
import { parseAzurePullRequestData, parseAzureCommitData, parseAzurePushData, parseAzurePullRequestNoteData } from "./azure-data-parser";
import {
    logPullRequestFetchingProgress,
    logPullRequestNoteFetchingProgress,
    logRepositoryFetchingCompletion,
    logRepositoryFetchingStart,
} from "./azure-logger";
import { AzurePullRequest, AzureCommit, AzurePush, AzurePullRequestNote, AzureRepository } from "./azure-models";

export const getAzurePullRequestsAndCommitsAndPushes = async (): Promise<[PullRequest[],Commit[],Push[]]> => {
    logRepositoryFetchingStart();

    const repositoryData: AzureRepository[] = await fetchAzureRepositoryData();
    let allPullRequests: PullRequest[] = [];
    let allCommits: Commit[] = [];
	let allPushes: Push[] = [];

    logRepositoryFetchingCompletion(repositoryData.length);

    for (let repoIndex = 0; repoIndex < repositoryData.length; repoIndex++) {
		// Fetch and parse pull requests
        const pullRequestsData: AzurePullRequest[] = await fetchAzurePullRequestsByProject(repositoryData[repoIndex].project.name);
        const validPullRequestsData = pullRequestsData.filter((pr: AzurePullRequest) => inConfigDateRange(pr.creationDate));
        const pullRequests: PullRequest[] = parseAzurePullRequestData(validPullRequestsData);
				
		// Fetch and parse commits
		const commitsData: AzureCommit[] = await fetchAzureCommitsByProject(repositoryData[repoIndex].project.name,repositoryData[repoIndex].name);
        const validCommitsData = commitsData.filter((c: AzureCommit) => inConfigDateRange(c.committer.date));
		const commits: Commit[] = parseAzureCommitData(validCommitsData);		

		// Fetch and parse pushes
		const pushesData: AzurePush[] = await fetchAzurePushesByProject(repositoryData[repoIndex].project.name,repositoryData[repoIndex].name);
        const validPushesData = pushesData.filter((c: AzurePush) => inConfigDateRange(c.date));
		const pushes: Push[] = parseAzurePushData(validPushesData);				
				
        logPullRequestFetchingProgress(repoIndex, repositoryData.length, pullRequests.length);
        for (let prIndex = 0; prIndex < pullRequests.length; prIndex++) {
            logPullRequestNoteFetchingProgress(repoIndex, repositoryData.length, prIndex, pullRequests.length);

            const threads: AzurePullRequestNote[] = await fetchPullRequestNotes(
                repositoryData[repoIndex].project.name,
				repositoryData[repoIndex].name,
                validPullRequestsData[prIndex].pullRequestId,
            );
            const validThreads = threads.filter((pr: AzurePullRequestNote) => inConfigDateRange(pr.lastUpdatedDate));

            pullRequests[prIndex].notes = parseAzurePullRequestNoteData(validThreads);
        }

        allPullRequests = allPullRequests.concat(pullRequests);
		allCommits = allCommits.concat(commits)
		allPushes = allPushes.concat(pushes)
    }

    logNoteCount(allPullRequests);
	logCommitCount(allCommits);
	logPushCount(allPushes);

    return [allPullRequests,allCommits,allPushes];
};

