import { NoteType } from "../../src/shared/note-type.enum";
import { PullRequestNote } from "../../src/shared/pull-request-note.model";
import { PullRequest } from "../../src/shared/pull-request.model";
import { Result } from "../../src/shared/result.model";

export const MOCK_PULL_REQUESTS_ALL: PullRequest[] = [
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

export const MOCK_RESULTS: Result[] = [
    new Result("John Howard", 2, 3, 2),
    new Result("Kevin Rudd", 1, 1, 1),
    new Result("Malcolm Turnbull", 0, 1, 1),
    new Result("Tony Abbott", 2, 1, 1),
];

export const MOCK_RESULTS_TABLE: (string | number)[][] = [
    ["Name", "Pull Requests", "Comments", "Approvals"],
    ["John Howard", 2, 3, 2],
    ["Tony Abbott", 2, 1, 1],
    ["Kevin Rudd", 1, 1, 1],
    ["Malcolm Turnbull", 0, 1, 1],
];
