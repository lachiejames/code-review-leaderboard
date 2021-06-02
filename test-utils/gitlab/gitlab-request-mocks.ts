import nock from "nock";

import { getGitlabHttpParams } from "../../src/gitlab/gitlab-data-gatherer";
import { GitlabPullRequestNoteData } from "../../src/gitlab/gitlab-models";

import fullPageMockResponse from "./mock-data/mock-gitlab-pull-request-lookup-full-page-response.json";
import mockPullRequestsResponse from "./mock-data/mock-gitlab-pull-request-lookup-response.json";
import mockPullRequestNotesResponse1 from "./mock-data/mock-gitlab-pull-request-notes-lookup-response-1.json";
import mockPullRequestNotesResponse2 from "./mock-data/mock-gitlab-pull-request-notes-lookup-response-2.json";
import mockPullRequestNotesResponse3 from "./mock-data/mock-gitlab-pull-request-notes-lookup-response-3.json";
import mockPullRequestNotesResponse4 from "./mock-data/mock-gitlab-pull-request-notes-lookup-response-4.json";
import mockPullRequestNotesResponse5 from "./mock-data/mock-gitlab-pull-request-notes-lookup-response-5.json";

const setMockPullRequestResponse = () => {
    nock("https://gitlab.example.com/").get("/api/v4/merge_requests").query(getGitlabHttpParams()).reply(200, mockPullRequestsResponse);
};

const setMockPullRequestNoteResponse = (projectID: number, pullRequestID: number, response: GitlabPullRequestNoteData[]) => {
    nock("https://gitlab.example.com/").get(`/api/v4/projects/${projectID}/merge_requests/${pullRequestID}/notes`).reply(200, response);
};

export const setGitlabRequestMocks = (): void => {
    setMockPullRequestResponse();
    setMockPullRequestNoteResponse(56, 2102, mockPullRequestNotesResponse1);
    setMockPullRequestNoteResponse(68, 137, mockPullRequestNotesResponse2);
    setMockPullRequestNoteResponse(195, 463, mockPullRequestNotesResponse3);
    setMockPullRequestNoteResponse(249, 88, mockPullRequestNotesResponse4);
    setMockPullRequestNoteResponse(73, 169, mockPullRequestNotesResponse5);
};

export const setGitlabFullPageMockResponse = (pageNumber: number): void => {
    nock("https://gitlab.example.com/")
        .get("/api/v4/merge_requests")
        .query(getGitlabHttpParams(pageNumber))
        .reply(200, fullPageMockResponse);
};

export const setGitlabPullRequestTimeoutResponse = (): void => {
    nock("https://gitlab.example.com/")
        .get("/api/v4/merge_requests")
        .query(getGitlabHttpParams())
        .times(4)
        .delayConnection(10)
        .reply(200, {});
};

export const setGitlabPullRequestErrorResponse = (responseCode: number): void => {
    nock("https://gitlab.example.com/").get("/api/v4/merge_requests").query(getGitlabHttpParams()).times(4).reply(responseCode, {});
};

export const setGitlabPullRequestTextErrorResponse = (text: string): void => {
    nock("https://gitlab.example.com/").get("/api/v4/merge_requests").query(getGitlabHttpParams()).times(4).replyWithError({ code: text });
};

export const setGitlabPullRequestNotesTimeoutResponse = (projectID: number, pullRequestID: number): void => {
    nock("https://gitlab.example.com/")
        .get(`/api/v4/projects/${projectID}/merge_requests/${pullRequestID}/notes`)
        .times(4)
        .delayConnection(10)
        .reply(200, {});
};
