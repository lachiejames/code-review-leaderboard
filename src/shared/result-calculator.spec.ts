import mockConsole from "jest-mock-console";

import { MOCK_PULL_REQUESTS_GITLAB } from "../../test-utils/gitlab/mock-pull-requests";
import { MOCK_RESULTS, MOCK_RESULTS_TABLE } from "../../test-utils/shared/mock-pull-requests";
import { setMockConfig } from "../../test-utils/shared/test-utils";

import { PullRequest } from "./pull-request.model";
import { calculateResults, createResultsTable, logResults, sortResults } from "./result-calculator";
import { Result } from "./result.model";

describe("result calculator", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("calculateResults()", () => {
        it("returns a list of results", () => {
            const pullRequests: PullRequest[] = MOCK_PULL_REQUESTS_GITLAB;
            const results: Result[] = calculateResults(pullRequests);
            expect(results).toEqual([
                { name: "John Howard", numApprovals: 2, numComments: 3, numPullRequests: 2 },
                { name: "Kevin Rudd", numApprovals: 1, numComments: 1, numPullRequests: 1 },
                { name: "Malcolm Turnbull", numApprovals: 0, numComments: 1, numPullRequests: 1 },
                { name: "Tony Abbott", numApprovals: 2, numComments: 1, numPullRequests: 1 },
            ]);
        });

        it("if pull request data is empty, returns an empty list", () => {
            const pullRequests: PullRequest[] = [];
            const results: Result[] = calculateResults(pullRequests);
            expect(results).toEqual([]);
        });
    });

    describe("sortResults()", () => {
        it("returns a sorted list of results", () => {
            const results: Result[] = sortResults(MOCK_RESULTS);
            expect(results).toEqual([
                { name: "John Howard", numApprovals: 2, numComments: 3, numPullRequests: 2 },
                { name: "Tony Abbott", numApprovals: 1, numComments: 1, numPullRequests: 2 },
                { name: "Kevin Rudd", numApprovals: 1, numComments: 1, numPullRequests: 1 },
                { name: "Malcolm Turnbull", numApprovals: 1, numComments: 1, numPullRequests: 0 },
            ]);
        });

        it("if results is empty, returns an empty list", () => {
            const results: Result[] = calculateResults([]);
            expect(results).toEqual([]);
        });
    });

    describe("createResultsTable()", () => {
        it("returns a sorted list of results", () => {
            const resultsTable = createResultsTable(MOCK_RESULTS);
            expect(resultsTable).toEqual([
                ["Name", "Pull Requests", "Comments", "Approvals"],
                ["John Howard", 2, 3, 2],
                ["Tony Abbott", 2, 1, 1],
                ["Kevin Rudd", 1, 1, 1],
                ["Malcolm Turnbull", 0, 1, 1],
            ]);
        });

        it("if results is empty, returns only the headings", () => {
            const resultsTable: (string | number)[][] = createResultsTable([]);
            expect(resultsTable).toEqual([["Name", "Pull Requests", "Comments", "Approvals"]]);
        });
    });

    describe("logResults()", () => {
        beforeEach(() => {
            mockConsole();
        });

        it("logs the table in the expected format", () => {
            logResults(MOCK_RESULTS_TABLE);
            expect(console.log).toHaveBeenCalledWith(
                `╔═════════════════════════════════════════════════════════╗\n` +
                    `║                 CODE REVIEW LEADERBOARD                 ║\n` +
                    `║                                                         ║\n` +
                    `║                 26/04/2021 - 07/05/2021                 ║\n` +
                    `╟──────────────────┬───────────────┬──────────┬───────────╢\n` +
                    `║       Name       │ Pull Requests │ Comments │ Approvals ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║   John Howard    │       2       │    3     │     2     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║   Tony Abbott    │       2       │    1     │     1     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║    Kevin Rudd    │       1       │    1     │     1     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║ Malcolm Turnbull │       0       │    1     │     1     ║\n` +
                    `╚══════════════════╧═══════════════╧══════════╧═══════════╝\n`,
            );
        });

        it("if results is empty, returns only the headings", () => {
            logResults([["Name", "Pull Requests", "Comments", "Approvals"]]);
            expect(console.log).toHaveBeenCalledWith(
                `╔═════════════════════════════════════════════╗\n` +
                    `║           CODE REVIEW LEADERBOARD           ║\n` +
                    `║                                             ║\n` +
                    `║           26/04/2021 - 07/05/2021           ║\n` +
                    `╟──────┬───────────────┬──────────┬───────────╢\n` +
                    `║ Name │ Pull Requests │ Comments │ Approvals ║\n` +
                    `╚══════╧═══════════════╧══════════╧═══════════╝\n`,
            );
        });
    });
});
