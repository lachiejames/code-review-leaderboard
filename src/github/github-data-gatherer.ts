import { GaxiosError, GaxiosResponse, request } from "gaxios";

import { getConfig } from "../config";

import { GithubHttpHeaders, GithubHttpParams, GithubPullRequestData, GithubPullRequestNoteData } from "./github-models";

const PULL_REQUEST_LOOKUP_PATH = "api/v4/merge_requests";
const PROJECT_LOOKUP_PATH = "api/v4/projects";
const MAX_LOOKUP_CALLS = 100;
const MAX_RESULTS_PER_PAGE = 100;

export const getGithubHttpHeaders = (): GithubHttpHeaders => {
    return {
        "PRIVATE-TOKEN": getConfig().github.personalAccessToken,
    };
};

export const getGithubHttpParams = (pageNumber?: number): GithubHttpParams => {
    return {
        scope: "all",
        state: "all",
        order_by: "updated_at",
        updated_before: getConfig().endDate.toISOString(),
        updated_after: getConfig().startDate.toISOString(),
        per_page: MAX_RESULTS_PER_PAGE,
        page: pageNumber ?? 1,
    };
};

const handleErrorResponse = (response: GaxiosError): void => {
    const baseErrorMessage = `Github responded with ${response?.code ?? response.message}`;

    if (response?.code === "ENOTFOUND") {
        throw Error(`${baseErrorMessage}, which likely means that your baseUrl (${getConfig().github.baseUrl}) is invalid`);
    } else if (response.response?.status === 401) {
        throw Error(`${baseErrorMessage}, which likely means that your personal access token is invalid`);
    } else {
        throw Error(baseErrorMessage);
    }
};

const fetchGithubPullRequestDataByPage = async (pageNumber: number): Promise<GithubPullRequestData[]> => {
    let pullRequestLookupResponse: GaxiosResponse<GithubPullRequestData[]> | undefined;

    await request<GithubPullRequestData[]>({
        baseUrl: getConfig().github.baseUrl,
        url: PULL_REQUEST_LOOKUP_PATH,
        method: "GET",
        params: getGithubHttpParams(pageNumber),
        headers: getGithubHttpHeaders(),
        timeout: getConfig().httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<GithubPullRequestData[]>) => (pullRequestLookupResponse = response))
        .catch((response: GaxiosError<GithubPullRequestData>) => handleErrorResponse(response));

    return pullRequestLookupResponse?.data ?? [];
};

export const fetchGithubPullRequestNoteData = async (projectID: number, pullRequestID: number): Promise<GithubPullRequestNoteData[]> => {
    let pullRequestNotesLookupResponse: GaxiosResponse<GithubPullRequestNoteData[]> | undefined;

    await request<GithubPullRequestNoteData[]>({
        baseUrl: getConfig().github.baseUrl,
        url: `${PROJECT_LOOKUP_PATH}/${projectID}/merge_requests/${pullRequestID}/notes`,
        method: "GET",
        headers: getGithubHttpHeaders(),
        timeout: getConfig().httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<GithubPullRequestNoteData[]>) => {
            pullRequestNotesLookupResponse = response;
        })
        .catch((response: GaxiosError<GithubPullRequestNoteData[]>) => handleErrorResponse(response));

    return pullRequestNotesLookupResponse?.data ?? [];
};

export const fetchAllGithubPullRequestData = async (): Promise<GithubPullRequestData[]> => {
    let pullRequestsData: GithubPullRequestData[] = [];

    for (let pageNumber = 1; pageNumber <= MAX_LOOKUP_CALLS; pageNumber++) {
        const lookupResults: GithubPullRequestData[] = await fetchGithubPullRequestDataByPage(pageNumber);
        pullRequestsData = pullRequestsData.concat(lookupResults);

        const noMoreResults: boolean = lookupResults.length < MAX_RESULTS_PER_PAGE;
        if (noMoreResults) {
            break;
        }
    }

    return pullRequestsData;
};
