import mockResponse from "../../test-utils/azure/mock-data/mock-pull-request-lookup-response-1.json";
import mockThreadsResponse from "../../test-utils/azure/mock-data/mock-pull-request-threads-lookup-response-4.json";
import { setMockConfig } from "../../test-utils/shared/test-utils";
import { NoteType } from "../shared/note-type.enum";
import { PullRequestNote } from "../shared/pull-request-note.model";
import { PullRequest } from "../shared/pull-request.model";

import { parseAzurePullRequestData, parseAzurePullRequestNoteData } from "./azure-data-parser";

describe("azure data parser", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("parseAzurePullRequestData()", () => {
        it("parsed data expected number of data entries", () => {
            const pullRequests: PullRequest[] = parseAzurePullRequestData(mockResponse.value);

            expect(pullRequests.length).toBe(3);
        });

        it("parsed data contains expected content", () => {
            const pullRequests: PullRequest[] = parseAzurePullRequestData(mockResponse.value);

            expect(pullRequests).toEqual([
                { authorName: "John Howard", notes: [] },
                { authorName: "Bob Hawke", notes: [] },
                { authorName: "John Howard", notes: [] },
            ]);
        });
    });

    describe("parseAzurePullRequestNoteData()", () => {
        it("parsed data expected number of data entries", () => {
            const pullRequestNotes: PullRequestNote[] = parseAzurePullRequestNoteData(mockThreadsResponse.value);

            expect(pullRequestNotes.length).toBe(3);
        });

        it("parsed data contains expected content", () => {
            const pullRequestNotes: PullRequestNote[] = parseAzurePullRequestNoteData(mockThreadsResponse.value);

            expect(pullRequestNotes).toEqual([
                {
                    authorName: "Paul Keating",
                    noteType: "approval",
                },
                {
                    authorName: "Julia Gillard",
                    noteType: "approval",
                },
                {
                    authorName: "Scott Morrison",
                    noteType: "comment",
                },
            ]);
        });

        it("parsed data contains expected number of approvals", () => {
            const pullRequestNotes: PullRequestNote[] = parseAzurePullRequestNoteData(mockThreadsResponse.value);

            const numApprovals: number = pullRequestNotes.filter((note: PullRequestNote) => note.noteType === NoteType.Approval).length;
            expect(numApprovals).toEqual(2);
        });

        it("parsed data contains expected number of comments", () => {
            const pullRequestNotes: PullRequestNote[] = parseAzurePullRequestNoteData(mockThreadsResponse.value);

            const numComments: number = pullRequestNotes.filter((note: PullRequestNote) => note.noteType === NoteType.Comment).length;
            expect(numComments).toEqual(1);
        });
    });
});
