import nock from "nock";

import { getGithubHttpParams } from "../../src/github/github-data-gatherer";
import { GithubPullRequestNoteData } from "../../src/github/github-models";

import fullPageMockResponse from "./mock-data/mock-github-pull-request-lookup-full-page-response.json";
import mockPullRequestsResponse from "./mock-data/mock-github-pull-request-lookup-response.json";
import mockPullRequestNotesResponse1 from "./mock-data/mock-github-pull-request-notes-lookup-response-1.json";
import mockPullRequestNotesResponse2 from "./mock-data/mock-github-pull-request-notes-lookup-response-2.json";
import mockPullRequestNotesResponse3 from "./mock-data/mock-github-pull-request-notes-lookup-response-3.json";
import mockPullRequestNotesResponse4 from "./mock-data/mock-github-pull-request-notes-lookup-response-4.json";
import mockPullRequestNotesResponse5 from "./mock-data/mock-github-pull-request-notes-lookup-response-5.json";

const setMockPullRequestResponse = () => {
    nock("https://github.example.com/").get("/api/v4/merge_requests").query(getGithubHttpParams()).reply(200, mockPullRequestsResponse);
};

const setMockPullRequestNoteResponse = (projectID: number, pullRequestID: number, response: GithubPullRequestNoteData[]) => {
    nock("https://github.example.com/").get(`/api/v4/projects/${projectID}/merge_requests/${pullRequestID}/notes`).reply(200, response);
};

export const setGithubRequestMocks = (): void => {
    setMockPullRequestResponse();
    setMockPullRequestNoteResponse(56, 2102, mockPullRequestNotesResponse1);
    setMockPullRequestNoteResponse(68, 137, mockPullRequestNotesResponse2);
    setMockPullRequestNoteResponse(195, 463, mockPullRequestNotesResponse3);
    setMockPullRequestNoteResponse(249, 88, mockPullRequestNotesResponse4);
    setMockPullRequestNoteResponse(73, 169, mockPullRequestNotesResponse5);
};

export const setGithubFullPageMockResponse = (pageNumber: number): void => {
    nock("https://github.example.com/")
        .get("/api/v4/merge_requests")
        .query(getGithubHttpParams(pageNumber))
        .reply(200, fullPageMockResponse);
};

export const setGithubPullRequestTimeoutResponse = (): void => {
    nock("https://github.example.com/")
        .get("/api/v4/merge_requests")
        .query(getGithubHttpParams())
        .times(4)
        .delayConnection(10)
        .reply(200, {});
};

export const setGithubPullRequestErrorResponse = (responseCode: number): void => {
    nock("https://github.example.com/").get("/api/v4/merge_requests").query(getGithubHttpParams()).times(4).reply(responseCode, {});
};

export const setGithubPullRequestTextErrorResponse = (text: string): void => {
    nock("https://github.example.com/").get("/api/v4/merge_requests").query(getGithubHttpParams()).times(4).replyWithError({ code: text });
};

export const setGithubPullRequestNotesTimeoutResponse = (projectID: number, pullRequestID: number): void => {
    nock("https://github.example.com/")
        .get(`/api/v4/projects/${projectID}/merge_requests/${pullRequestID}/notes`)
        .times(4)
        .delayConnection(10)
        .reply(200, {});
};
