import ora, { Ora } from "ora";

import { NoteType } from "./note-type.enum";
import { PullRequestNote } from "./pull-request-note.model";
import { PullRequest } from "./pull-request.model";
import { Commit } from "./commit.model";
import { Push } from "./push.model";

export const terminalSpinner: Ora = ora();

const countPullRequestNotesByType = (notes: PullRequestNote[], noteType: NoteType) => {
    return notes.filter((note: PullRequestNote) => note.noteType === noteType).length;
};

const countPullRequestActivity = (pullRequests: PullRequest[], noteType: NoteType): number => {
    if (pullRequests.length === 0) {
        return 0;
    }

    return pullRequests
        .map((pr: PullRequest) => countPullRequestNotesByType(pr.notes, noteType))
        .reduce((accumulator: number, numApprovals: number) => accumulator + numApprovals);
};

export const logNoteCount = (pullRequests: PullRequest[]): void => {
    const totalComments = countPullRequestActivity(pullRequests, NoteType.Comment);
    const totalApprovals = countPullRequestActivity(pullRequests, NoteType.Approval);
    terminalSpinner.succeed(`Found ${totalComments} comments and ${totalApprovals} approvals\n`);
};

export const logCommitCount = (commits: Commit[]): void => {
    const totalCommits = commits.length;
    terminalSpinner.succeed(`Found ${totalCommits} commits\n`);
};

export const logPushCount = (pushes: Push[]): void => {
    const totalPushes = pushes.length;
    terminalSpinner.succeed(`Found ${totalPushes} pushes\n`);
};

export const logCalculationStart = (): void => {
    terminalSpinner.start("Calculating results...");
};

export const logCalculationComplete = (): void => {
    terminalSpinner.stopAndPersist();
    terminalSpinner.succeed("Done\n");
};

export const logError = (error: Error): void => {
    terminalSpinner.stopAndPersist();
    terminalSpinner.fail(error.toString());
};
