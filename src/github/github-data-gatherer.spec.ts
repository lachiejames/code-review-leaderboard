import { cleanAll } from "nock";

import {
    setGithubFullPageMockResponse,
    setGithubPullRequestErrorResponse,
    setGithubPullRequestNotesTimeoutResponse,
    setGithubPullRequestTextErrorResponse,
    setGithubPullRequestTimeoutResponse,
    setGithubRequestMocks,
} from "../../test-utils/github/github-request-mocks";
import { setMockConfig } from "../../test-utils/shared/test-utils";
import { overrideConfig } from "../config";

import { fetchAllGithubPullRequestData, fetchGithubPullRequestNoteData } from "./github-data-gatherer";
import { GithubPullRequestData, GithubPullRequestNoteData } from "./github-models";

describe("github data gatherer", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("fetchAllGithubPullRequestData()", () => {
        it("response contains expected number of data entries", async () => {
            setGithubRequestMocks();
            const data: GithubPullRequestData[] = await fetchAllGithubPullRequestData();
            expect(data.length).toBe(5);
        });

        it("response data contains expected content", async () => {
            setGithubRequestMocks();
            const data: GithubPullRequestData[] = await fetchAllGithubPullRequestData();
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
                setGithubFullPageMockResponse(pageNumber);
            }

            const data: GithubPullRequestData[] = await fetchAllGithubPullRequestData();
            expect(data.length).toBe(10000);
        });

        describe("error responses", () => {
            beforeEach(() => {
                cleanAll();
            });

            it("throws expected error when HTTP request times out", async () => {
                overrideConfig({ httpTimeoutInMS: 1 });
                setGithubPullRequestTimeoutResponse();

                await expect(fetchAllGithubPullRequestData()).rejects.toThrowError(
                    "network timeout at: https://github.example.com/api/v4/merge_requests?scope=all&state=all&order_by=updated_at&updated_before=2021-05-07T00%3A00%3A00.000Z&updated_after=2021-04-26T00%3A00%3A00.000Z&per_page=100&page=1",
                );
            });

            it("throws expected error when 203 response is returned", async () => {
                setGithubPullRequestTextErrorResponse("ENOTFOUND");

                await expect(fetchAllGithubPullRequestData()).rejects.toThrowError(
                    "Github responded with ENOTFOUND, which likely means that your baseUrl (https://github.example.com/) is invalid",
                );
            });

            it("throws expected error when 401 response is returned", async () => {
                setGithubPullRequestErrorResponse(401);

                await expect(fetchAllGithubPullRequestData()).rejects.toThrowError(
                    "Github responded with 401, which likely means that your personal access token is invalid",
                );
            });

            it("throws expected error when 404 response is returned", async () => {
                setGithubPullRequestErrorResponse(404);

                await expect(fetchAllGithubPullRequestData()).rejects.toThrowError("Github responded with 404");
            });
        });
    });

    describe("fetchGithubPullRequestNoteData()", () => {
        it("response contains expected number of data entries", async () => {
            setGithubRequestMocks();

            const data: GithubPullRequestNoteData[] = await fetchGithubPullRequestNoteData(56, 2102);
            expect(data.length).toBe(4);
        });

        it("response data contains expected content", async () => {
            setGithubRequestMocks();

            const data: GithubPullRequestNoteData[] = await fetchGithubPullRequestNoteData(56, 2102);
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
            overrideConfig({ httpTimeoutInMS: 1 });
            setGithubPullRequestNotesTimeoutResponse(56, 2102);

            await expect(fetchGithubPullRequestNoteData(56, 2102)).rejects.toThrowError(
                "network timeout at: https://github.example.com/api/v4/projects/56/merge_requests/2102/notes",
            );
        });
    });
});
