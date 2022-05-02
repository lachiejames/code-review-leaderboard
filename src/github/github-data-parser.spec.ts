import mockResponse from "../../test-utils/github/mock-data/mock-github-pull-request-lookup-response.json";
import mockNotesResponse from "../../test-utils/github/mock-data/mock-github-pull-request-notes-lookup-response-1.json";
import { setMockConfig } from "../../test-utils/shared/test-utils";
import { NoteType } from "../shared/note-type.enum";
import { PullRequestNote } from "../shared/pull-request-note.model";

import { parseGithubPullRequestData, parseGithubPullRequestNoteData } from "./github-data-parser";

describe("github data parser", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("parseGithubPullRequestData()", () => {
        it("parsed data expected number of data entries", () => {
            const pullRequests = parseGithubPullRequestData(mockResponse);

            expect(pullRequests.length).toBe(5);
        });

        it("parsed data contains expected content", () => {
            const pullRequests = parseGithubPullRequestData(mockResponse);

            expect(pullRequests[0]).toEqual({
                authorName: "John Howard",
                notes: [],
            });
        });
    });

    describe("parseGithubPullRequestNoteData()", () => {
        it("parsed contains expected number of data entries", () => {
            const pullRequestNotes: PullRequestNote[] = parseGithubPullRequestNoteData(mockNotesResponse);

            expect(pullRequestNotes.length).toBe(4);
        });

        it("parsed data contains expected content", () => {
            const pullRequestNotes: PullRequestNote[] = parseGithubPullRequestNoteData(mockNotesResponse);

            expect(pullRequestNotes[0]).toEqual({
                authorName: "Kevin Rudd",
                noteType: NoteType.Comment,
            });
        });

        it("parsed data contains expected number of comments", () => {
            const pullRequestNotes: PullRequestNote[] = parseGithubPullRequestNoteData(mockNotesResponse);

            const numApprovals: number = pullRequestNotes.filter((note: PullRequestNote) => note.noteType === NoteType.Approval).length;
            expect(numApprovals).toEqual(1);
        });

        it("parsed data contains expected number of approvals", () => {
            const pullRequestNotes: PullRequestNote[] = parseGithubPullRequestNoteData(mockNotesResponse);

            const numComments: number = pullRequestNotes.filter((note: PullRequestNote) => note.noteType === NoteType.Comment).length;
            expect(numComments).toEqual(3);
        });
    });
});
