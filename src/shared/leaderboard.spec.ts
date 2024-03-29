import MockConsole from "jest-mock-console";

import { setAzureRequestMocks } from "../../test-utils/azure/azure-request-mocks";
import { MOCK_PULL_REQUESTS_AZURE } from "../../test-utils/azure/mock-pull-requests";
import { setGithubRequestMocks } from "../../test-utils/github/github-request-mocks";
import { setGitlabRequestMocks } from "../../test-utils/gitlab/gitlab-request-mocks";
import { MOCK_PULL_REQUESTS_GITLAB } from "../../test-utils/gitlab/mock-pull-requests";
import { MOCK_PULL_REQUESTS_ALL } from "../../test-utils/shared/mock-pull-requests";
import { setMockConfig } from "../../test-utils/shared/test-utils";
import { getConfig, overrideConfig } from "../config";

import { calculateAndShowLeaderboard, getAllPullRequestData, run } from "./leaderboard";
import { PullRequest } from "./pull-request.model";

describe("leaderboard", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("getAllPullRequestData()", () => {
        beforeEach(() => {
            setGitlabRequestMocks();
            setGithubRequestMocks();
            setAzureRequestMocks();
        });

        describe("if Azure and Gitlab are enabled", () => {
            beforeEach(() => {
                overrideConfig({
                    github: { ...getConfig().github, enabled: false },
                });
            });

            it("returns expected number of pull requests", async () => {
                const pullRequests: PullRequest[] = await getAllPullRequestData();
                expect(pullRequests.length).toEqual(11);
            });

            it("pull requests contain expected content", async () => {
                const pullRequests: PullRequest[] = await getAllPullRequestData();
                expect(pullRequests).toEqual(MOCK_PULL_REQUESTS_ALL);
            });
        });

        describe("if only Gitlab is enabled", () => {
            beforeEach(() => {
                overrideConfig({
                    azure: { ...getConfig().azure, enabled: false },
                    github: { ...getConfig().github, enabled: false },
                });
            });

            it("returns expected number of pull requests", async () => {
                const pullRequests: PullRequest[] = await getAllPullRequestData();
                expect(pullRequests.length).toEqual(5);
            });

            it("pull requests contain expected content", async () => {
                const pullRequests: PullRequest[] = await getAllPullRequestData();
                expect(pullRequests).toEqual(MOCK_PULL_REQUESTS_GITLAB);
            });
        });

        describe("if only Azure is enabled", () => {
            beforeEach(() => {
                overrideConfig({ gitlab: { ...getConfig().gitlab, enabled: false } });
                overrideConfig({
                    github: { ...getConfig().github, enabled: false },
                    gitlab: { ...getConfig().gitlab, enabled: false },
                });
            });

            it("returns expected number of pull requests", async () => {
                const pullRequests: PullRequest[] = await getAllPullRequestData();
                expect(pullRequests.length).toEqual(6);
            });

            it("pull requests contain expected content", async () => {
                const pullRequests: PullRequest[] = await getAllPullRequestData();
                expect(pullRequests).toEqual(MOCK_PULL_REQUESTS_AZURE);
            });
        });

        describe("if all platforms are disabled", () => {
            beforeEach(() => {
                overrideConfig({ azure: { ...getConfig().azure, enabled: false } });
                overrideConfig({ github: { ...getConfig().github, enabled: false } });
                overrideConfig({ gitlab: { ...getConfig().gitlab, enabled: false } });
            });

            it("returns expected number of pull requests", async () => {
                const pullRequests: PullRequest[] = await getAllPullRequestData();
                expect(pullRequests.length).toEqual(0);
            });

            it("pull requests contain expected content", async () => {
                const pullRequests: PullRequest[] = await getAllPullRequestData();
                expect(pullRequests).toEqual([]);
            });
        });
    });

    describe("calculateAndShowLeaderboard()", () => {
        beforeEach(() => {
            MockConsole();
        });

        it("logs expected data", () => {
            calculateAndShowLeaderboard(MOCK_PULL_REQUESTS_ALL);
            expect(console.log).toHaveBeenCalledWith(
                `╔═════════════════════════════════════════════════════════╗\n` +
                    `║                 CODE REVIEW LEADERBOARD                 ║\n` +
                    `║                                                         ║\n` +
                    `║                 26/04/2021 - 07/05/2021                 ║\n` +
                    `╟──────────────────┬───────────────┬──────────┬───────────╢\n` +
                    `║       Name       │ Pull Requests │ Comments │ Approvals ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║   John Howard    │       4       │    4     │     2     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║   Tony Abbott    │       1       │    1     │     2     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║    Bob Hawke     │       2       │    1     │     1     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║    Kevin Rudd    │       1       │    1     │     1     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║ Malcolm Turnbull │       1       │    1     │     0     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║  Malcolm Fraser  │       2       │    0     │     0     ║\n` +
                    `╚══════════════════╧═══════════════╧══════════╧═══════════╝\n`,
            );
        });
    });

    describe("run()", () => {
        beforeEach(() => {
            MockConsole();
            setGitlabRequestMocks();
            setGithubRequestMocks();
            setAzureRequestMocks();
        });

        it("logs expected data", async () => {
            await run();
            expect(console.log).toHaveBeenCalledWith(
                `╔═════════════════════════════════════════════════════════╗\n` +
                    `║                 CODE REVIEW LEADERBOARD                 ║\n` +
                    `║                                                         ║\n` +
                    `║                 26/04/2021 - 07/05/2021                 ║\n` +
                    `╟──────────────────┬───────────────┬──────────┬───────────╢\n` +
                    `║       Name       │ Pull Requests │ Comments │ Approvals ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║   John Howard    │       6       │    5     │     2     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║    Bob Hawke     │       4       │    2     │     2     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║   Tony Abbott    │       1       │    1     │     2     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║    Kevin Rudd    │       1       │    1     │     1     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║ Malcolm Turnbull │       1       │    1     │     0     ║\n` +
                    `╟──────────────────┼───────────────┼──────────┼───────────╢\n` +
                    `║  Malcolm Fraser  │       4       │    0     │     0     ║\n` +
                    `╚══════════════════╧═══════════════╧══════════╧═══════════╝\n`,
            );
        });
    });
});
