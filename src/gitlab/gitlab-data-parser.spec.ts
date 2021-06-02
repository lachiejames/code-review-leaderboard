import mockResponse from "../../test-utils/gitlab/mock-data/mock-gitlab-pull-request-lookup-response.json";
import mockNotesResponse from "../../test-utils/gitlab/mock-data/mock-gitlab-pull-request-notes-lookup-response-1.json";
import { setMockConfig } from "../../test-utils/shared/test-utils";
import { NoteType } from "../shared/note-type.enum";
import { PullRequestNote } from "../shared/pull-request-note.model";

import { parseGitlabPullRequestData, parseGitlabPullRequestNoteData } from "./gitlab-data-parser";

describe("gitlab data parser", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("parseGitlabPullRequestData()", () => {
        it("parsed data expected number of data entries", () => {
            const pullRequests = parseGitlabPullRequestData(mockResponse);

            expect(pullRequests.length).toBe(5);
        });

        it("parsed data contains expected content", () => {
            const pullRequests = parseGitlabPullRequestData(mockResponse);

            expect(pullRequests[0]).toEqual({
                authorName: "John Howard",
                notes: [],
            });
        });
    });

    describe("parseGitlabPullRequestNoteData()", () => {
        it("parsed contains expected number of data entries", () => {
            const pullRequestNotes: PullRequestNote[] = parseGitlabPullRequestNoteData(mockNotesResponse);

            expect(pullRequestNotes.length).toBe(4);
        });

        it("parsed data contains expected content", () => {
            const pullRequestNotes: PullRequestNote[] = parseGitlabPullRequestNoteData(mockNotesResponse);

            expect(pullRequestNotes[0]).toEqual({
                authorName: "Kevin Rudd",
                noteType: NoteType.Comment,
            });
        });

        it("parsed data contains expected number of comments", () => {
            const pullRequestNotes: PullRequestNote[] = parseGitlabPullRequestNoteData(mockNotesResponse);

            const numApprovals: number = pullRequestNotes.filter((note: PullRequestNote) => note.noteType === NoteType.Approval).length;
            expect(numApprovals).toEqual(1);
        });

        it("parsed data contains expected number of approvals", () => {
            const pullRequestNotes: PullRequestNote[] = parseGitlabPullRequestNoteData(mockNotesResponse);

            const numComments: number = pullRequestNotes.filter((note: PullRequestNote) => note.noteType === NoteType.Comment).length;
            expect(numComments).toEqual(3);
        });
    });
});
