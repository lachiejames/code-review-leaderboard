import { cleanAll } from "nock";

import config from "../../code-review-leaderboard.config";
import {
    setAzurePullRequestThreadsTimeoutResponse,
    setAzurePullRequestTimeoutResponse,
    setAzureRepositoryErrorResponse,
    setAzureRepositoryTimeoutResponse,
    setAzureRequestMocks,
} from "../../test-utils/azure/azure-request-mocks";
import { setMockConfig } from "../../test-utils/shared/test-utils";

import { fetchAzurePullRequestsByProject, fetchAzureRepositoryData, fetchPullRequestNotes } from "./azure-data-gatherer";
import { AzurePullRequest, AzurePullRequestNote, AzureRepository } from "./azure-models";

describe("azure data gatherer", () => {
    beforeEach(() => {
        setMockConfig();
        setAzureRequestMocks();
    });

    describe("fetchAzureRepositoryData()", () => {
        it("response contains expected number of data entries", async () => {
            const data: AzureRepository[] = await fetchAzureRepositoryData();
            expect(data.length).toBe(2);
        });

        it("response data contains expected content", async () => {
            const data: AzureRepository[] = await fetchAzureRepositoryData();
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
                config.httpTimeoutInMS = 1;
                setAzureRepositoryTimeoutResponse();

                await expect(fetchAzureRepositoryData()).rejects.toThrowError(
                    "network timeout at: https://dev.azure.com/MyOrg/_apis/git/repositories",
                );
            });

            it("throws expected error when 203 response is returned", async () => {
                setAzureRepositoryErrorResponse(203);

                await expect(fetchAzureRepositoryData()).rejects.toThrowError(
                    "Azure responded with 203 - Non-Authoritative Information, which likely means that your personal access token is invalid",
                );
            });

            it("throws expected error when 201 response is returned", async () => {
                setAzureRepositoryErrorResponse(202);

                await expect(fetchAzureRepositoryData()).rejects.toThrowError("Azure responded with 202 - Accepted");
            });

            it("throws expected error when 401 response is returned", async () => {
                setAzureRepositoryErrorResponse(401);

                await expect(fetchAzureRepositoryData()).rejects.toThrowError(
                    "Azure responded with 401 - Unauthorized, which likely means that you do not have permission to access https://dev.azure.com/MyOrg",
                );
            });

            it("throws expected error when 404 response is returned", async () => {
                setAzureRepositoryErrorResponse(404);

                await expect(fetchAzureRepositoryData()).rejects.toThrowError(
                    "Azure responded with 404 - Not Found, which likely means that your baseUrl (https://dev.azure.com/MyOrg) is invalid",
                );
            });

            it("throws expected error when 500 response is returned", async () => {
                setAzureRepositoryErrorResponse(500);

                await expect(fetchAzureRepositoryData()).rejects.toThrowError("Azure responded with 500 - Internal Server Error");
            });
        });
    });

    describe("fetchAzurePullRequestsByProject()", () => {
        it("response contains expected number of data entries", async () => {
            const data: AzurePullRequest[] = await fetchAzurePullRequestsByProject("work-choices");
            expect(data.length).toBe(3);
        });

        it("response data contains expected content", async () => {
            const data: AzurePullRequest[] = await fetchAzurePullRequestsByProject("work-choices");
            expect(data[0]).toEqual({
                createdBy: {
                    displayName: "Malcolm Fraser",
                },
                creationDate: "2021-05-01T15:07:48.9638653Z",
                pullRequestId: 3433,
            });
        });

        it("logs expected error when HTTP request times out", async () => {
            config.httpTimeoutInMS = 1;
            setAzurePullRequestTimeoutResponse("nbn");

            await expect(fetchAzurePullRequestsByProject("nbn")).rejects.toThrowError(
                "network timeout at: https://dev.azure.com/MyOrg/nbn/_apis/git/pullrequests?api-version=6&%24top=1000&searchCriteria.status=all",
            );
        });
    });

    describe("fetchPullRequestNotes()", () => {
        it("response contains expected number of data entries", async () => {
            const data: AzurePullRequestNote[] = await fetchPullRequestNotes("nbn", 3454);
            expect(data.length).toBe(1);
        });

        it("response data contains expected content", async () => {
            const data: AzurePullRequestNote[] = await fetchPullRequestNotes("nbn", 3454);
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
            config.httpTimeoutInMS = 1;
            setAzurePullRequestThreadsTimeoutResponse("nbn", 3454);

            await expect(fetchPullRequestNotes("nbn", 3454)).rejects.toThrowError(
                "network timeout at: https://dev.azure.com/MyOrg/nbn/_apis/git/repositories/nbn/pullrequests/3454/threads",
            );
        });
    });
});
