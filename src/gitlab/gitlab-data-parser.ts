import { NoteType } from "../shared/note-type.enum";
import { PullRequestNote } from "../shared/pull-request-note.model";
import { PullRequest } from "../shared/pull-request.model";

import { GitlabPullRequestData, GitlabPullRequestNoteData } from "./gitlab-models";

export const parseGitlabPullRequestData = (pullRequestsData: GitlabPullRequestData[]): PullRequest[] => {
    return pullRequestsData.map((data: GitlabPullRequestData) => new PullRequest(data.author.name));
};

const determineNoteType = (data: GitlabPullRequestNoteData): NoteType => {
    if (data.body === "approved this merge request") {
        return NoteType.Approval;
    } else if (data.resolvable === true) {
        return NoteType.Comment;
    } else {
        return NoteType.Unknown;
    }
};

export const parseGitlabPullRequestNoteData = (pullRequestNotesData: GitlabPullRequestNoteData[]): PullRequestNote[] => {
    return pullRequestNotesData
        .map((data: GitlabPullRequestNoteData) => new PullRequestNote(data.author.name, determineNoteType(data)))
        .filter((note: PullRequestNote) => note.noteType === NoteType.Approval || note.noteType === NoteType.Comment);
};
