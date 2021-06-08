import { cleanAll } from "nock";

import {
    setGitlabFullPageMockResponse,
    setGitlabPullRequestErrorResponse,
    setGitlabPullRequestNotesTimeoutResponse,
    setGitlabPullRequestTextErrorResponse,
    setGitlabPullRequestTimeoutResponse,
    setGitlabRequestMocks,
} from "../../test-utils/gitlab/gitlab-request-mocks";
import { setMockConfig } from "../../test-utils/shared/test-utils";
import { getConfig } from "../config";

import { fetchAllGitlabPullRequestData, fetchGitlabPullRequestNoteData } from "./gitlab-data-gatherer";
import { GitlabPullRequestData, GitlabPullRequestNoteData } from "./gitlab-models";

describe("gitlab data gatherer", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("fetchAllGitlabPullRequestData()", () => {
        it("response contains expected number of data entries", async () => {
            setGitlabRequestMocks();
            const data: GitlabPullRequestData[] = await fetchAllGitlabPullRequestData();
            expect(data.length).toBe(5);
        });

        it("response data contains expected content", async () => {
            setGitlabRequestMocks();
            const data: GitlabPullRequestData[] = await fetchAllGitlabPullRequestData();
            expect(data[0]).toEqual({
                author: {
                    name: "John Howard",
                },
                iid: 463,
                project_id: 195,
                updated_at: "2021-05-03T04:42:23.465Z",
                user_notes_count: 25,
            });
        });

        it("will fetch a maximum of 100000 merge requests", async () => {
            for (let pageNumber = 1; pageNumber <= 100; pageNumber++) {
                setGitlabFullPageMockResponse(pageNumber);
            }

            const data: GitlabPullRequestData[] = await fetchAllGitlabPullRequestData();
            expect(data.length).toBe(10000);
        });

        describe("error responses", () => {
            beforeEach(() => {
                cleanAll();
            });

            it("throws expected error when HTTP request times out", async () => {
                config.httpTimeoutInMS = 1;
                setGitlabPullRequestTimeoutResponse();

                await expect(fetchAllGitlabPullRequestData()).rejects.toThrowError(
                    "network timeout at: https://gitlab.example.com/api/v4/merge_requests?scope=all&state=all&order_by=updated_at&updated_before=2021-05-07T00%3A00%3A00.000Z&updated_after=2021-04-26T00%3A00%3A00.000Z&per_page=100&page=1",
                );
            });

            it("throws expected error when 203 response is returned", async () => {
                setGitlabPullRequestTextErrorResponse("ENOTFOUND");

                await expect(fetchAllGitlabPullRequestData()).rejects.toThrowError(
                    "Gitlab responded with ENOTFOUND, which likely means that your baseUrl (https://gitlab.example.com/) is invalid",
                );
            });

            it("throws expected error when 401 response is returned", async () => {
                setGitlabPullRequestErrorResponse(401);

                await expect(fetchAllGitlabPullRequestData()).rejects.toThrowError(
                    "Gitlab responded with 401, which likely means that your personal access token is invalid",
                );
            });

            it("throws expected error when 404 response is returned", async () => {
                setGitlabPullRequestErrorResponse(404);

                await expect(fetchAllGitlabPullRequestData()).rejects.toThrowError("Gitlab responded with 404");
            });
        });
    });

    describe("fetchGitlabPullRequestNoteData()", () => {
        it("response contains expected number of data entries", async () => {
            setGitlabRequestMocks();

            const data: GitlabPullRequestNoteData[] = await fetchGitlabPullRequestNoteData(56, 2102);
            expect(data.length).toBe(4);
        });

        it("response data contains expected content", async () => {
            setGitlabRequestMocks();

            const data: GitlabPullRequestNoteData[] = await fetchGitlabPullRequestNoteData(56, 2102);
            expect(data[0]).toEqual({
                author: {
                    name: "Kevin Rudd",
                },
                body: "Australia is a nation of compassion. Courage and compassion. And the third of these great values: resilience.",
                resolvable: true,
                updated_at: "2021-05-07T06:40:16.115Z",
            });
        });

        it("logs expected error when HTTP request times out", async () => {
            config.httpTimeoutInMS = 1;
            setGitlabPullRequestNotesTimeoutResponse(56, 2102);

            await expect(fetchGitlabPullRequestNoteData(56, 2102)).rejects.toThrowError(
                "network timeout at: https://gitlab.example.com/api/v4/projects/56/merge_requests/2102/notes",
            );
        });
    });
});
