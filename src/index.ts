import { verifyConfig } from "./shared/config-verifier";
import { calculateAndShowLeaderboard, getAllPullRequestData } from "./shared/leaderboard";
import { PullRequest } from "./shared/pull-request.model";
import { logError } from "./shared/shared-logger";

export const run = async (): Promise<void> => {
    try {
        verifyConfig();

        const pullRequests: PullRequest[] = await getAllPullRequestData();
        calculateAndShowLeaderboard(pullRequests);
    } catch (error) {
        logError(error);
    }
};

run();
