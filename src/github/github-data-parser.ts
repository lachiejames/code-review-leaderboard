import { NoteType } from "../shared/note-type.enum";
import { PullRequestNote } from "../shared/pull-request-note.model";
import { PullRequest } from "../shared/pull-request.model";

import { GithubPullRequestData, GithubPullRequestNoteData } from "./github-models";

export const parseGithubPullRequestData = (pullRequestsData: GithubPullRequestData[]): PullRequest[] => {
    return pullRequestsData.map((data: GithubPullRequestData) => new PullRequest(data.author.name));
};

const determineNoteType = (data: GithubPullRequestNoteData): NoteType => {
    if (data.body === "approved this merge request") {
        return NoteType.Approval;
    } else if (data.resolvable === true) {
        return NoteType.Comment;
    } else {
        return NoteType.Unknown;
    }
};

export const parseGithubPullRequestNoteData = (pullRequestNotesData: GithubPullRequestNoteData[]): PullRequestNote[] => {
    return pullRequestNotesData
        .map((data: GithubPullRequestNoteData) => new PullRequestNote(data.author.name, determineNoteType(data)))
        .filter((note: PullRequestNote) => note.noteType === NoteType.Approval || note.noteType === NoteType.Comment);
};
