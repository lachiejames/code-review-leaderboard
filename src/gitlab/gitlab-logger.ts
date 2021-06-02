import { terminalSpinner } from "../shared/shared-logger";

export const logPullRequestFetchingStart = (): void => {
    terminalSpinner.start("Fetching GitLab pull requests...");
};

export const logPullRequestFetchingProgress = (prIndex: number, numPRs: number): void => {
    if (prIndex === 0) {
        terminalSpinner.start("");
    }

    terminalSpinner.text = `Fetching comments and approvals for each pull request... ${prIndex + 1}/${numPRs}`;

    if (prIndex + 1 === numPRs) {
        terminalSpinner.stopAndPersist();
    }
};

export const logPullRequestFetchingCompletion = (numPullRequests: number): void => {
    terminalSpinner.stopAndPersist();
    terminalSpinner.succeed(`Found ${numPullRequests} pull requests!`);
};
