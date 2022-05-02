import { isWithinInterval } from "date-fns";
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

const BASE_URL = "https://api.github.com";
const MAX_LOOKUP_CALLS = 100;
const MAX_RESULTS_PER_PAGE = 100;

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
    if (response.response === undefined) throw response;

    const baseErrorMessage = `Github responded with ${response.response.status} - ${response.response.statusText}`;

    if (response.response.status === 403) {
        throw Error(`${baseErrorMessage}, which likely means that your personal access token is invalid`);
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

export const getGithubHttpParams = (pageNumber?: number): GithubHttpParams => {
    return {
        state: "all",
        per_page: MAX_RESULTS_PER_PAGE,
        page: pageNumber ?? 1,
        sort: "updated",
        direction: "desc",
    };
};

export const getGithubOrg = (): string => {
    const baseUrl: string = getConfig().github.baseUrl;
    const baseUrlArray: string[] = baseUrl.split("/");
    const lastUrlParam: string | undefined = baseUrlArray.pop();

    return lastUrlParam ?? "";
};

export const fetchPullRequestNotes = async (projectName: string, pullRequestID: number): Promise<GithubPullRequestNote[]> => {
    let pullRequestLookupResponse: GaxiosResponse<GithubPullRequestNoteResponse> | undefined;

    await request<GithubPullRequestNoteResponse>({
        baseUrl: BASE_URL,
        url: `/repos/${getGithubOrg()}/${projectName}/pulls/${pullRequestID}/reviews`,
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

    return pullRequestLookupResponse?.data ?? [];
};

const fetchGithubPullRequestsByProject = async (projectName: string, pageNumber: number): Promise<GithubPullRequest[]> => {
    let pullRequestLookupResponse: GaxiosResponse<GithubPullRequestResponse> | undefined;

    await request<GithubPullRequestResponse>({
        baseUrl: BASE_URL,
        url: `/repos/${getGithubOrg()}/${projectName}/pulls`,
        method: "GET",
        params: getGithubHttpParams(pageNumber),
        headers: getGithubHttpHeaders(),
        timeout: getConfig().httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<GithubPullRequestResponse>) => {
            validateSuccessResponse(response);
            pullRequestLookupResponse = response;
        })
        .catch((response: GaxiosError<GithubPullRequestResponse>) => handleErrorResponse(response));

    return pullRequestLookupResponse?.data ?? [];
};

const inConfigDateRange = (prDateString: string): boolean => {
    const prDate = new Date(prDateString);
    const allowedDateRange: Interval = { start: getConfig().startDate, end: getConfig().endDate };

    return isWithinInterval(prDate, allowedDateRange);
};

export const fetchAllGithubPullRequestsForProject = async (projectName: string): Promise<GithubPullRequest[]> => {
    let pullRequestsData: GithubPullRequest[] = [];

    for (let pageNumber = 1; pageNumber <= MAX_LOOKUP_CALLS; pageNumber++) {
        const lookupResults: GithubPullRequest[] = await fetchGithubPullRequestsByProject(projectName, pageNumber);
        pullRequestsData = pullRequestsData.concat(lookupResults);

        const noMoreResults: boolean = lookupResults.length < MAX_LOOKUP_CALLS;
        const lastResultInPage: string = lookupResults?.[lookupResults.length - 1].updated_at;
        const resultsNoLongerInDateRange = !inConfigDateRange(lastResultInPage);
        if (noMoreResults || resultsNoLongerInDateRange) {
            break;
        }
    }

    return pullRequestsData;
};

export const fetchGithubRepositoryData = async (): Promise<GithubRepository[]> => {
    let repositoryLookupResponse: GaxiosResponse<GithubRepositoryResponse> | undefined;

    await request<GithubRepositoryResponse>({
        baseUrl: BASE_URL,
        url: `/orgs/${getGithubOrg()}/repos`,
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

    return repositoryLookupResponse?.data ?? [];
};
