import { PullRequest } from "../shared/pull-request.model";
import { logNoteCount } from "../shared/shared-logger";

import { fetchAllGithubPullRequestData, fetchGithubPullRequestNoteData } from "./github-data-gatherer";
import { parseGithubPullRequestData, parseGithubPullRequestNoteData } from "./github-data-parser";
import { logPullRequestFetchingCompletion, logPullRequestFetchingProgress, logPullRequestFetchingStart } from "./github-logger";
import { GithubPullRequestData, GithubPullRequestNoteData } from "./github-models";

export const getGithubPullRequests = async (): Promise<PullRequest[]> => {
    logPullRequestFetchingStart();

    const pullRequestsData: GithubPullRequestData[] = await fetchAllGithubPullRequestData();
    const pullRequests: PullRequest[] = parseGithubPullRequestData(pullRequestsData);

    logPullRequestFetchingCompletion(pullRequestsData.length);

    for (let prIndex = 0; prIndex < pullRequests.length; prIndex++) {
        logPullRequestFetchingProgress(prIndex, pullRequests.length);
        const noteData: GithubPullRequestNoteData[] = await fetchGithubPullRequestNoteData(
            pullRequestsData[prIndex].project_id,
            pullRequestsData[prIndex].iid,
        );

        pullRequests[prIndex].notes = parseGithubPullRequestNoteData(noteData);
    }

    logNoteCount(pullRequests);

    return pullRequests;
};
