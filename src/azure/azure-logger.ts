import { terminalSpinner } from "../shared/shared-logger";

export const logRepositoryFetchingStart = (): void => {
    terminalSpinner.start("Fetching Azure repositories...");
};

export const logPullRequestFetchingProgress = (repoIndex: number, numRepos: number, numPRs: number): void => {
    if (repoIndex === 0) {
        terminalSpinner.start("");
    }

    terminalSpinner.text = `Fetching pull requests & commits for each repository... ${repoIndex + 1}/${numRepos}`;

    if (repoIndex + 1 === numRepos && numPRs === 0) {
        terminalSpinner.stopAndPersist();
    }
};

export const logPullRequestNoteFetchingProgress = (repoIndex: number, numRepos: number, prIndex: number, numPRs: number): void => {
    const repoText = `Fetching pull requests for each repository... ${repoIndex + 1}/${numRepos}`;
    const prText = `Fetching comments and approvals for pull request ${prIndex + 1}/${numPRs}...`;
    terminalSpinner.text = `${repoText}\n  ${prText}`;

    if (repoIndex + 1 === numRepos && prIndex + 1 === numPRs) {
        terminalSpinner.stopAndPersist();
    }
};

export const logRepositoryFetchingCompletion = (numRepos: number): void => {
    terminalSpinner.stopAndPersist();
    terminalSpinner.succeed(`Found ${numRepos} repositories!`);
};

