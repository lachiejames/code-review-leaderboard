import { NoteType } from "../shared/note-type.enum";
import { PullRequestNote } from "../shared/pull-request-note.model";
import { PullRequest } from "../shared/pull-request.model";

import { GithubPullRequest, GithubPullRequestNote } from "./github-models";

export const parseGithubPullRequestData = (data: GithubPullRequest[]): PullRequest[] => {
    return data.map((pr) => new PullRequest(pr.user.login));
};

const determineNoteType = (state: string): NoteType => {
    if (state === "COMMENTED") {
        return NoteType.Comment;
    } else if (state === "APPROVED") {
        return NoteType.Approval;
    } else {
        return NoteType.Unknown;
    }
};

export const parseGithubPullRequestNoteData = (threads: GithubPullRequestNote[]): PullRequestNote[] => {
    const pullRequestNotes: PullRequestNote[] = [];

    for (const thread of threads) {
        const note = new PullRequestNote(thread.user.login, determineNoteType(thread.state));
        if (note.noteType === NoteType.Approval || note.noteType === NoteType.Comment) {
            pullRequestNotes.push(note);
        }
    }

    return pullRequestNotes;
};
