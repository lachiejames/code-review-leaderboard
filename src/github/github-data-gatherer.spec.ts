import { cleanAll } from "nock";

import {
    setGithubPullRequestThreadsTimeoutResponse,
    setGithubPullRequestTimeoutResponse,
    setGithubRepositoryErrorResponse,
    setGithubRepositoryTimeoutResponse,
    setGithubRequestMocks,
} from "../../test-utils/github/github-request-mocks";
import { setMockConfig } from "../../test-utils/shared/test-utils";
import { overrideConfig } from "../config";

import { fetchGithubPullRequestsByProject, fetchGithubRepositoryData, fetchPullRequestNotes } from "./github-data-gatherer";
import { GithubPullRequest, GithubPullRequestNote, GithubRepository } from "./github-models";

describe("github data gatherer", () => {
    beforeEach(() => {
        setMockConfig();
        setGithubRequestMocks();
    });

    describe("fetchGithubRepositoryData()", () => {
        it("response contains expected number of data entries", async () => {
            const data: GithubRepository[] = await fetchGithubRepositoryData();
            expect(data.length).toBe(2);
        });

        it("response data contains expected content", async () => {
            const data: GithubRepository[] = await fetchGithubRepositoryData();
            expect(data[0]).toEqual({
                name: "nbn",
                project: {
                    lastUpdateTime: "2020-10-10T23:10:12.057Z",
                },
            });
        });

        describe("error responses", () => {
            beforeEach(() => {
                cleanAll();
            });

            it("throws expected error when HTTP request times out", async () => {
                overrideConfig({ httpTimeoutInMS: 1 });
                setGithubRepositoryTimeoutResponse();

                await expect(fetchGithubRepositoryData()).rejects.toThrowError(
                    "network timeout at: https://api.github.com/orgs/MyOrg/repos",
                );
            });

            it("throws expected error when 203 response is returned", async () => {
                setGithubRepositoryErrorResponse(203);

                await expect(fetchGithubRepositoryData()).rejects.toThrowError(
                    "Github responded with 203 - Non-Authoritative Information, which likely means that your personal access token is invalid",
                );
            });

            it("throws expected error when 201 response is returned", async () => {
                setGithubRepositoryErrorResponse(202);

                await expect(fetchGithubRepositoryData()).rejects.toThrowError("Github responded with 202 - Accepted");
            });

            it("throws expected error when 401 response is returned", async () => {
                setGithubRepositoryErrorResponse(401);

                await expect(fetchGithubRepositoryData()).rejects.toThrowError(
                    "Github responded with 401 - Unauthorized, which likely means that you do not have permission to access https://github.com/MyOrg",
                );
            });

            it("throws expected error when 404 response is returned", async () => {
                setGithubRepositoryErrorResponse(404);

                await expect(fetchGithubRepositoryData()).rejects.toThrowError(
                    "Github responded with 404 - Not Found, which likely means that your baseUrl (https://github.com/MyOrg) is invalid",
                );
            });

            it("throws expected error when 500 response is returned", async () => {
                setGithubRepositoryErrorResponse(500);

                await expect(fetchGithubRepositoryData()).rejects.toThrowError("Github responded with 500 - Internal Server Error");
            });
        });
    });

    describe("fetchGithubPullRequestsByProject()", () => {
        it("response contains expected number of data entries", async () => {
            const data: GithubPullRequest[] = await fetchGithubPullRequestsByProject("work-choices");
            expect(data.length).toBe(3);
        });

        it("response data contains expected content", async () => {
            const data: GithubPullRequest[] = await fetchGithubPullRequestsByProject("work-choices");
            expect(data[0]).toEqual({
                createdBy: {
                    displayName: "Malcolm Fraser",
                },
                creationDate: "2021-05-01T15:07:48.9638653Z",
                pullRequestId: 3433,
            });
        });

        it("logs expected error when HTTP request times out", async () => {
            overrideConfig({ httpTimeoutInMS: 1 });
            setGithubPullRequestTimeoutResponse("nbn");

            await expect(fetchGithubPullRequestsByProject("nbn")).rejects.toThrowError("");
        });
    });

    describe("fetchPullRequestNotes()", () => {
        it("response contains expected number of data entries", async () => {
            const data: GithubPullRequestNote[] = await fetchPullRequestNotes("nbn", 3454);
            expect(data.length).toBe(1);
        });

        it("response data contains expected content", async () => {
            const data: GithubPullRequestNote[] = await fetchPullRequestNotes("nbn", 3454);
            expect(data[0]).toEqual({
                comments: [
                    {
                        author: {
                            displayName: "Bob Hawke",
                        },
                        commentType: "text",
                        content: "The things which are most important don't always scream the loudest.",
                        lastUpdatedDate: "2021-05-02T04:05:23.387Z",
                    },
                    {
                        author: {
                            displayName: "John Howard",
                        },
                        commentType: "text",
                        content: "I hate guns.",
                        lastUpdatedDate: "2021-05-02T06:14:14.4Z",
                    },
                ],
                lastUpdatedDate: "2021-05-02T06:14:25.803Z",
            });
        });

        it("logs expected error when HTTP request times out", async () => {
            overrideConfig({ httpTimeoutInMS: 1 });
            setGithubPullRequestThreadsTimeoutResponse("nbn", 3454);

            await expect(fetchPullRequestNotes("nbn", 3454)).rejects.toThrowError(
                "network timeout at: ", //broken
            );
        });
    });
});
