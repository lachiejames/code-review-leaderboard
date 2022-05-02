import { NoteType } from "../../src/shared/note-type.enum";
import { PullRequestNote } from "../../src/shared/pull-request-note.model";
import { PullRequest } from "../../src/shared/pull-request.model";

export const MOCK_PULL_REQUESTS_GITLAB: PullRequest[] = [
    new PullRequest("John Howard", [
        new PullRequestNote("Tony Abbott", NoteType.Approval),
        new PullRequestNote("John Howard", NoteType.Approval),
    ]),
    new PullRequest("Kevin Rudd", [
        new PullRequestNote("Kevin Rudd", NoteType.Comment),
        new PullRequestNote("John Howard", NoteType.Comment),
        new PullRequestNote("Tony Abbott", NoteType.Comment),
        new PullRequestNote("Kevin Rudd", NoteType.Approval),
    ]),
    new PullRequest("John Howard", []),
    new PullRequest("Malcolm Turnbull", [
        new PullRequestNote("Tony Abbott", NoteType.Approval),
        new PullRequestNote("John Howard", NoteType.Comment),
        new PullRequestNote("John Howard", NoteType.Comment),
    ]),
    new PullRequest("Tony Abbott", [
        new PullRequestNote("Malcolm Turnbull", NoteType.Comment),
        new PullRequestNote("John Howard", NoteType.Approval),
    ]),
];
