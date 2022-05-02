import nock from "nock";

import { getGithubHttpParams } from "../../src/github/github-data-gatherer";
import { GithubPullRequestNoteResponse, GithubPullRequestResponse, GithubRepositoryResponse } from "../../src/github/github-models";

import mockPullRequestResponse1 from "./mock-data/mock-pull-request-lookup-response-1.json";
import mockPullRequestResponse2 from "./mock-data/mock-pull-request-lookup-response-2.json";
import mockPullRequestThreadResponse1 from "./mock-data/mock-pull-request-threads-lookup-response-1.json";
import mockPullRequestThreadResponse2 from "./mock-data/mock-pull-request-threads-lookup-response-2.json";
import mockPullRequestThreadResponse3 from "./mock-data/mock-pull-request-threads-lookup-response-3.json";
import mockPullRequestThreadResponse4 from "./mock-data/mock-pull-request-threads-lookup-response-4.json";
import mockPullRequestThreadResponse5 from "./mock-data/mock-pull-request-threads-lookup-response-5.json";
import mockPullRequestThreadResponse6 from "./mock-data/mock-pull-request-threads-lookup-response-6.json";
import mockRepositoryResponse from "./mock-data/mock-repository-lookup-response.json";

const setMockRepositoryResponse = (response: GithubRepositoryResponse) => {
    nock("https://api.github.com/").get("/orgs/MyOrg/repos").reply(200, response);
};

const setMockPullRequestResponse = (projectName: string, response: GithubPullRequestResponse) => {
    nock("https://api.github.com/").get(`/repos/MyOrg/${projectName}/pulls`).query(getGithubHttpParams()).reply(200, response);
};

const setMockPullRequestThreadResponse = (projectName: string, pullRequestID: number, response: GithubPullRequestNoteResponse) => {
    nock("https://api.github.com/").get(`/repos/MyOrg/${projectName}/pulls/${pullRequestID}/reviews`).reply(200, response);
};

export const setGithubRequestMocks = (): void => {
    setMockRepositoryResponse(mockRepositoryResponse);

    setMockPullRequestResponse(mockRepositoryResponse[0].name, mockPullRequestResponse1);
    setMockPullRequestResponse(mockRepositoryResponse[1].name, mockPullRequestResponse2);

    setMockPullRequestThreadResponse(mockRepositoryResponse[0].name, mockPullRequestResponse1[0].number, mockPullRequestThreadResponse1);
    setMockPullRequestThreadResponse(mockRepositoryResponse[0].name, mockPullRequestResponse1[1].number, mockPullRequestThreadResponse2);
    setMockPullRequestThreadResponse(mockRepositoryResponse[0].name, mockPullRequestResponse1[2].number, mockPullRequestThreadResponse3);

    setMockPullRequestThreadResponse(mockRepositoryResponse[1].name, mockPullRequestResponse2[0].number, mockPullRequestThreadResponse4);
    setMockPullRequestThreadResponse(mockRepositoryResponse[1].name, mockPullRequestResponse2[1].number, mockPullRequestThreadResponse5);
    setMockPullRequestThreadResponse(mockRepositoryResponse[1].name, mockPullRequestResponse2[2].number, mockPullRequestThreadResponse6);
};

export const setGithubRepositoryTimeoutResponse = (): void => {
    nock("https://api.github.com/").get("/orgs/MyOrg/repos").times(4).delayConnection(10).reply(200, []);
};

export const setGithubRepositoryErrorResponse = (responseCode: number): void => {
    nock("https://api.github.com/").get("/orgs/MyOrg/repos").times(4).reply(responseCode, []);
};

export const setGithubPullRequestTimeoutResponse = (projectName: string): void => {
    nock("https://api.github.com/")
        .get(`/repos/MyOrg/${projectName}/pulls`)
        .query(getGithubHttpParams())
        .times(4)
        .delayConnection(10)
        .reply(200, []);
};

export const setGithubPullRequestThreadsTimeoutResponse = (projectName: string, pullRequestID: number): void => {
    nock("https://api.github.com/")
        .get(`/repos/MyOrg/${projectName}/pulls/${pullRequestID}/reviews`)
        .times(4)
        .delayConnection(10)
        .reply(200, []);
};
