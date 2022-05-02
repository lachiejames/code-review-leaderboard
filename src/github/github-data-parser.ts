import { NoteType } from "../shared/note-type.enum";
import { PullRequestNote } from "../shared/pull-request-note.model";
import { PullRequest } from "../shared/pull-request.model";

import { GithubComment, GithubPullRequest, GithubPullRequestNote } from "./github-models";

export const parseGithubPullRequestData = (data: GithubPullRequest[]): PullRequest[] => {
    return data.map((pr) => new PullRequest(pr.createdBy.displayName));
};

const approvalRegex = /[a-zA-Z ]+ voted [0-9]+/;

const determineNoteType = (data: GithubComment): NoteType => {
    if (data.commentType === "text") {
        return NoteType.Comment;
    } else if (data.content.match(approvalRegex)) {
        return NoteType.Approval;
    } else {
        return NoteType.Unknown;
    }
};

export const parseGithubPullRequestNoteData = (threads: GithubPullRequestNote[]): PullRequestNote[] => {
    const pullRequestNotes: PullRequestNote[] = [];

    for (const thread of threads) {
        for (const comment of thread.comments) {
            const note = new PullRequestNote(comment.author.displayName, determineNoteType(comment));
            if (note.noteType === NoteType.Approval || note.noteType === NoteType.Comment) {
                pullRequestNotes.push(note);
            }
        }
    }

    return pullRequestNotes;
};
