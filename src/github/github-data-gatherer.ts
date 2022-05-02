import { GaxiosError, GaxiosResponse, request } from "gaxios";

import { getConfig } from "../config";

import {
    GithubHttpHeaders,
    GithubHttpParams,
    GithubPullRequest,
    GithubPullRequestNote,
    GithubPullRequestNoteResponse,
    GithubPullRequestResponse,
    GithubRepository,
    GithubRepositoryResponse,
} from "./github-models";

const getBase64PAT = (): string => {
    const token = `:${getConfig().github.personalAccessToken}`;
    const tokenBase64: string = Buffer.from(token).toString("base64");
    return tokenBase64;
};

const validateSuccessResponse = (response: GaxiosResponse): void => {
    const baseErrorMessage = `Github responded with ${response.status} - ${response.statusText}`;

    if (response.status === 200) {
        return;
    } else if (response.status === 203) {
        throw Error(`${baseErrorMessage}, which likely means that your personal access token is invalid`);
    } else {
        throw Error(baseErrorMessage);
    }
};

const handleErrorResponse = (response: GaxiosError): void => {
    // Re-throw the error from validateSuccessResponse()
    // Necessary because 203 responses indicate an error, but are not interpreted as an error by Gaxios
    if (response.response === undefined) {
        throw response;
    }

    const baseErrorMessage = `Github responded with ${response.response.status} - ${response.response.statusText}`;

    if (response.response.status === 401) {
        throw Error(`${baseErrorMessage}, which likely means that you do not have permission to access ${getConfig().github.baseUrl}`);
    } else if (response.response.status === 404) {
        throw Error(`${baseErrorMessage}, which likely means that your baseUrl (${getConfig().github.baseUrl}) is invalid`);
    } else {
        throw Error(baseErrorMessage);
    }
};

export const getGithubHttpHeaders = (): GithubHttpHeaders => {
    return {
        Authorization: `Basic ${getBase64PAT()}`,
    };
};

export const getGithubHttpParams = (): GithubHttpParams => {
    return {
        "api-version": 6.0,
        "$top": 1000,
        "searchCriteria.status": "all",
    };
};

export const fetchPullRequestNotes = async (projectName: string, pullRequestID: number): Promise<GithubPullRequestNote[]> => {
    let pullRequestLookupResponse: GaxiosResponse<GithubPullRequestNoteResponse> | undefined;

    await request<GithubPullRequestNoteResponse>({
        baseUrl: getConfig().github.baseUrl,
        url: `/${projectName}/_apis/git/repositories/${projectName}/pullrequests/${pullRequestID}/threads`,
        method: "GET",
        headers: getGithubHttpHeaders(),
        timeout: getConfig().httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<GithubPullRequestNoteResponse>) => {
            validateSuccessResponse(response);
            pullRequestLookupResponse = response;
        })
        .catch((response: GaxiosError<GithubPullRequestNoteResponse>) => handleErrorResponse(response));

    return pullRequestLookupResponse?.data.value ?? [];
};

export const fetchGithubPullRequestsByProject = async (projectName: string): Promise<GithubPullRequest[]> => {
    let pullRequestLookupResponse: GaxiosResponse<GithubPullRequestResponse> | undefined;

    await request<GithubPullRequestResponse>({
        baseUrl: getConfig().github.baseUrl,
        url: `/${projectName}/_apis/git/pullrequests`,
        method: "GET",
        params: getGithubHttpParams(),
        headers: getGithubHttpHeaders(),
        timeout: getConfig().httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<GithubPullRequestResponse>) => {
            validateSuccessResponse(response);
            pullRequestLookupResponse = response;
        })
        .catch((response: GaxiosError<GithubPullRequestResponse>) => handleErrorResponse(response));

    return pullRequestLookupResponse?.data.value ?? [];
};

export const fetchGithubRepositoryData = async (): Promise<GithubRepository[]> => {
    let repositoryLookupResponse: GaxiosResponse<GithubRepositoryResponse> | undefined;

    await request<GithubRepositoryResponse>({
        baseUrl: getConfig().github.baseUrl,
        url: `/_apis/git/repositories`,
        method: "GET",
        headers: getGithubHttpHeaders(),
        timeout: getConfig().httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<GithubRepositoryResponse>) => {
            validateSuccessResponse(response);
            repositoryLookupResponse = response;
        })
        .catch((response: GaxiosError<GithubRepositoryResponse>) => handleErrorResponse(response));

    return repositoryLookupResponse?.data.value ?? [];
};
