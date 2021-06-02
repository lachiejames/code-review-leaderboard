import { PullRequest } from "../shared/pull-request.model";
import { logNoteCount } from "../shared/shared-logger";

import { fetchAllGitlabPullRequestData, fetchGitlabPullRequestNoteData } from "./gitlab-data-gatherer";
import { parseGitlabPullRequestData, parseGitlabPullRequestNoteData } from "./gitlab-data-parser";
import { logPullRequestFetchingCompletion, logPullRequestFetchingProgress, logPullRequestFetchingStart } from "./gitlab-logger";
import { GitlabPullRequestData, GitlabPullRequestNoteData } from "./gitlab-models";

export const getGitlabPullRequests = async (): Promise<PullRequest[]> => {
    logPullRequestFetchingStart();

    const pullRequestsData: GitlabPullRequestData[] = await fetchAllGitlabPullRequestData();
    const pullRequests: PullRequest[] = parseGitlabPullRequestData(pullRequestsData);

    logPullRequestFetchingCompletion(pullRequestsData.length);

    for (let prIndex = 0; prIndex < pullRequests.length; prIndex++) {
        logPullRequestFetchingProgress(prIndex, pullRequests.length);
        const noteData: GitlabPullRequestNoteData[] = await fetchGitlabPullRequestNoteData(
            pullRequestsData[prIndex].project_id,
            pullRequestsData[prIndex].iid,
        );

        pullRequests[prIndex].notes = parseGitlabPullRequestNoteData(noteData);
    }

    logNoteCount(pullRequests);

    return pullRequests;
};
