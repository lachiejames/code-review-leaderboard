import nock from "nock";

import { getAzureHttpParams } from "../../src/azure/azure-data-gatherer";
import { AzurePullRequestNoteResponse, AzurePullRequestResponse, AzureRepositoryResponse } from "../../src/azure/azure-models";

import mockPullRequestResponse1 from "./mock-data/mock-pull-request-lookup-response-1.json";
import mockPullRequestResponse2 from "./mock-data/mock-pull-request-lookup-response-2.json";
import mockPullRequestThreadResponse1 from "./mock-data/mock-pull-request-threads-lookup-response-1.json";
import mockPullRequestThreadResponse2 from "./mock-data/mock-pull-request-threads-lookup-response-2.json";
import mockPullRequestThreadResponse3 from "./mock-data/mock-pull-request-threads-lookup-response-3.json";
import mockPullRequestThreadResponse4 from "./mock-data/mock-pull-request-threads-lookup-response-4.json";
import mockPullRequestThreadResponse5 from "./mock-data/mock-pull-request-threads-lookup-response-5.json";
import mockPullRequestThreadResponse6 from "./mock-data/mock-pull-request-threads-lookup-response-6.json";
import mockRepositoryResponse from "./mock-data/mock-repository-lookup-response.json";

const setMockRepositoryResponse = (response: AzureRepositoryResponse) => {
    nock("https://dev.azure.com/MyOrg/").get("/_apis/git/repositories").reply(200, response);
};

const setMockPullRequestResponse = (projectName: string, response: AzurePullRequestResponse) => {
    nock("https://dev.azure.com/MyOrg/").get(`/${projectName}/_apis/git/pullrequests`).query(getAzureHttpParams()).reply(200, response);
};

const setMockPullRequestThreadResponse = (projectName: string, pullRequestID: number, response: AzurePullRequestNoteResponse) => {
    nock("https://dev.azure.com/MyOrg/")
        .get(`/${projectName}/_apis/git/repositories/${projectName}/pullrequests/${pullRequestID}/threads`)
        .reply(200, response);
};

export const setAzureRequestMocks = (): void => {
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

export const setAzureRepositoryTimeoutResponse = (): void => {
    nock("https://dev.azure.com/MyOrg/").get("/_apis/git/repositories").times(4).delayConnection(10).reply(200, []);
};

export const setAzureRepositoryErrorResponse = (responseCode: number): void => {
    nock("https://dev.azure.com/MyOrg/").get("/_apis/git/repositories").times(4).reply(responseCode, []);
};

export const setAzurePullRequestTimeoutResponse = (projectName: string): void => {
    nock("https://dev.azure.com/MyOrg/")
        .get(`/${projectName}/_apis/git/pullrequests`)
        .query(getAzureHttpParams())
        .times(4)
        .delayConnection(10)
        .reply(200, []);
};

export const setAzurePullRequestThreadsTimeoutResponse = (projectName: string, pullRequestID: number): void => {
    nock("https://dev.azure.com/MyOrg/")
        .get(`/${projectName}/_apis/git/repositories/${projectName}/pullrequests/${pullRequestID}/threads`)
        .times(4)
        .delayConnection(10)
        .reply(200, []);
};
