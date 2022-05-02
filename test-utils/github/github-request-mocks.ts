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
    nock("https://github.com/").get("/orgs/MyOrg/repos").reply(200, response);
};

const setMockPullRequestResponse = (projectName: string, response: GithubPullRequestResponse) => {
    nock("https://github.com/").get(`/repos/MyOrg/${projectName}/pulls`).query(getGithubHttpParams()).reply(200, response);
};

const setMockPullRequestThreadResponse = (projectName: string, pullRequestID: number, response: GithubPullRequestNoteResponse) => {
    nock("https://github.com/").get(`/repos/MyOrg/${projectName}/pulls/${pullRequestID}/comments`).reply(200, response);
};

export const setGithubRequestMocks = (): void => {
    setMockRepositoryResponse(mockRepositoryResponse);

    setMockPullRequestResponse(mockRepositoryResponse.value[0].name, mockPullRequestResponse1);
    setMockPullRequestResponse(mockRepositoryResponse.value[1].name, mockPullRequestResponse2);

    setMockPullRequestThreadResponse(
        mockRepositoryResponse.value[0].name,
        mockPullRequestResponse1.value[0].pullRequestId,
        mockPullRequestThreadResponse1,
    );
    setMockPullRequestThreadResponse(
        mockRepositoryResponse.value[0].name,
        mockPullRequestResponse1.value[1].pullRequestId,
        mockPullRequestThreadResponse2,
    );
    setMockPullRequestThreadResponse(
        mockRepositoryResponse.value[0].name,
        mockPullRequestResponse1.value[2].pullRequestId,
        mockPullRequestThreadResponse3,
    );

    setMockPullRequestThreadResponse(
        mockRepositoryResponse.value[1].name,
        mockPullRequestResponse2.value[0].pullRequestId,
        mockPullRequestThreadResponse4,
    );
    setMockPullRequestThreadResponse(
        mockRepositoryResponse.value[1].name,
        mockPullRequestResponse2.value[1].pullRequestId,
        mockPullRequestThreadResponse5,
    );
    setMockPullRequestThreadResponse(
        mockRepositoryResponse.value[1].name,
        mockPullRequestResponse2.value[2].pullRequestId,
        mockPullRequestThreadResponse6,
    );
};

export const setGithubRepositoryTimeoutResponse = (): void => {
    nock("https://github.com/").get("/orgs/MyOrg/repos").times(4).delayConnection(10).reply(200, []);
};

export const setGithubRepositoryErrorResponse = (responseCode: number): void => {
    nock("https://github.com/").get("/orgs/MyOrg/repos").times(4).reply(responseCode, []);
};

export const setGithubPullRequestTimeoutResponse = (projectName: string): void => {
    nock("https://github.com/")
        .get(`/repos/MyOrg/${projectName}/pulls`)
        .query(getGithubHttpParams())
        .times(4)
        .delayConnection(10)
        .reply(200, []);
};

export const setGithubPullRequestThreadsTimeoutResponse = (projectName: string, pullRequestID: number): void => {
    nock("https://github.com/")
        .get(`/repos/MyOrg/${projectName}/pulls/${pullRequestID}/comments`)
        .times(4)
        .delayConnection(10)
        .reply(200, []);
};
