import { GaxiosError, GaxiosResponse, request } from "gaxios";

import { getConfig } from "../config";

import {
    AzureHttpHeaders,
    AzureHttpParams,
    AzurePullRequest,
	AzurePullRequestResponse,
	AzureCommit,
	AzureCommitResponse,
	AzurePush,
	AzurePushResponse,
    AzurePullRequestNote,
    AzurePullRequestNoteResponse,    
    AzureRepository,
    AzureRepositoryResponse,
} from "./azure-models";

const getBase64PAT = (): string => {
    const token = `:${getConfig().azure.personalAccessToken}`;
    const tokenBase64: string = Buffer.from(token).toString("base64");
    return tokenBase64;
};

const validateSuccessResponse = (response: GaxiosResponse): void => {
    const baseErrorMessage = `Azure responded with ${response.status} - ${response.statusText}`;

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

    const baseErrorMessage = `Azure responded with ${response.response.status} - ${response.response.statusText}`;

    if (response.response.status === 401) {
        throw Error(`${baseErrorMessage}, which likely means that you do not have permission to access ${getConfig().azure.baseUrl}`);
    } else if (response.response.status === 404) {
        throw Error(`${baseErrorMessage}, which likely means that your baseUrl (${getConfig().azure.baseUrl}) is invalid`);
    } else {
        throw Error(baseErrorMessage);
    }
};

export const getAzureHttpHeaders = (): AzureHttpHeaders => {
    return {
        Authorization: `Basic ${getBase64PAT()}`,
    };
};

export const getAzureHttpParams = (): AzureHttpParams => {
    return {
        "api-version": 6.0,
        "$top": 1000,
        "searchCriteria.status": "all",
    };
};

export const fetchPullRequestNotes = async (projectName: string, repositoryName: string, pullRequestID: number): Promise<AzurePullRequestNote[]> => {
    let pullRequestLookupResponse: GaxiosResponse<AzurePullRequestNoteResponse> | undefined;
	
    await request<AzurePullRequestNoteResponse>({
        baseUrl: getConfig().azure.baseUrl,
        url: `/${projectName}/_apis/git/repositories/${repositoryName}/pullrequests/${pullRequestID}/threads`,
        method: "GET",
        headers: getAzureHttpHeaders(),
        timeout: getConfig().httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<AzurePullRequestNoteResponse>) => {
            validateSuccessResponse(response);
            pullRequestLookupResponse = response;
        })
        .catch((response: GaxiosError<AzurePullRequestNoteResponse>) => {
			console.log(getConfig().azure.baseUrl + `/${projectName}/_apis/git/repositories/${projectName}/pullrequests/${pullRequestID}/threads`);
			handleErrorResponse(response);
		})

    return pullRequestLookupResponse?.data.value ?? [];
};

export const fetchAzurePullRequestsByProject = async (projectName: string): Promise<AzurePullRequest[]> => {
    let pullRequestLookupResponse: GaxiosResponse<AzurePullRequestResponse> | undefined;
    
	await request<AzurePullRequestResponse>({
        baseUrl: getConfig().azure.baseUrl,
        url: `/${projectName}/_apis/git/pullrequests`,
        method: "GET",
        params: getAzureHttpParams(),
        headers: getAzureHttpHeaders(),
        timeout: getConfig().httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<AzurePullRequestResponse>) => {
            validateSuccessResponse(response);
            pullRequestLookupResponse = response;
        })
        .catch((response: GaxiosError<AzurePullRequestResponse>) => {
			console.log(getConfig().azure.baseUrl + `/${projectName}/_apis/git/pullrequests`);
			handleErrorResponse(response);
		})

    return pullRequestLookupResponse?.data.value ?? [];
};

export const fetchAzureCommitsByProject = async (projectName: string, repositoryName: string): Promise<AzureCommit[]> => {
    let CommitLookupResponse: GaxiosResponse<AzureCommitResponse> | undefined;
    
	await request<AzureCommitResponse>({
        baseUrl: getConfig().azure.baseUrl,
        url: `/${projectName}/_apis/git/repositories/${repositoryName}/commits`,
        method: "GET",
        params: getAzureHttpParams(),
        headers: getAzureHttpHeaders(),
        timeout: getConfig().httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<AzureCommitResponse>) => {
            validateSuccessResponse(response);
            CommitLookupResponse = response;
        })
        .catch((response: GaxiosError<AzureCommitResponse>) => {
			console.log(getConfig().azure.baseUrl + `/${projectName}/_apis/git/repositories/${repositoryName}/commits`,);
			handleErrorResponse(response);
		})

    return CommitLookupResponse?.data.value ?? [];
};

export const fetchAzurePushesByProject = async (projectName: string, repositoryName: string): Promise<AzurePush[]> => {
    let PushLookupResponse: GaxiosResponse<AzurePushResponse> | undefined;
    
	await request<AzurePushResponse>({
        baseUrl: getConfig().azure.baseUrl,
        url: `/${projectName}/_apis/git/repositories/${repositoryName}/pushes`,
        method: "GET",
        params: getAzureHttpParams(),
        headers: getAzureHttpHeaders(),
        timeout: getConfig().httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<AzurePushResponse>) => {
            validateSuccessResponse(response);
            PushLookupResponse = response;
        })
        .catch((response: GaxiosError<AzurePushResponse>) => {
			console.log(getConfig().azure.baseUrl + `/${projectName}/_apis/git/repositories/${repositoryName}/pushes`,);
			handleErrorResponse(response);
		})

    return PushLookupResponse?.data.value ?? [];
};


export const fetchAzureRepositoryData = async (): Promise<AzureRepository[]> => {
    let repositoryLookupResponse: GaxiosResponse<AzureRepositoryResponse> | undefined;
    
	await request<AzureRepositoryResponse>({
        baseUrl: getConfig().azure.baseUrl,
        url: `/_apis/git/repositories`,
        method: "GET",
        headers: getAzureHttpHeaders(),
        timeout: getConfig().httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<AzureRepositoryResponse>) => {
            validateSuccessResponse(response);
            repositoryLookupResponse = response;
        })
        .catch((response: GaxiosError<AzureRepositoryResponse>) => {
			console.log(getConfig().azure.baseUrl + `/_apis/git/repositories`);
			handleErrorResponse(response);
		})

    return repositoryLookupResponse?.data.value ?? [];
};
