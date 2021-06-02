import { NoteType } from "../../src/shared/note-type.enum";
import { PullRequestNote } from "../../src/shared/pull-request-note.model";
import { PullRequest } from "../../src/shared/pull-request.model";

export const MOCK_PULL_REQUESTS_AZURE: PullRequest[] = [
    new PullRequest("John Howard", [
        new PullRequestNote("Bob Hawke", NoteType.Comment),
        new PullRequestNote("John Howard", NoteType.Comment),
    ]),
    new PullRequest("Bob Hawke", []),
    new PullRequest("John Howard", [
        new PullRequestNote("Gough Whitlam", NoteType.Approval),
        new PullRequestNote("Bob Hawke", NoteType.Approval),
    ]),
    new PullRequest("Malcolm Fraser", [
        new PullRequestNote("Paul Keating", NoteType.Approval),
        new PullRequestNote("Julia Gillard", NoteType.Approval),
        new PullRequestNote("Scott Morrison", NoteType.Comment),
    ]),
    new PullRequest("Bob Hawke", []),
    new PullRequest("Malcolm Fraser", [new PullRequestNote("Scott Morrison", NoteType.Approval)]),
];
