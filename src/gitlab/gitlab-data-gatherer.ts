import { GaxiosError, GaxiosResponse, request } from "gaxios";

import config from "../../code-review-leaderboard.config";

import { GitlabHttpHeaders, GitlabHttpParams, GitlabPullRequestData, GitlabPullRequestNoteData } from "./gitlab-models";

const PULL_REQUEST_LOOKUP_PATH = "api/v4/merge_requests";
const PROJECT_LOOKUP_PATH = "api/v4/projects";
const MAX_LOOKUP_CALLS = 100;
const MAX_RESULTS_PER_PAGE = 100;

export const getGitlabHttpHeaders = (): GitlabHttpHeaders => {
    return {
        "PRIVATE-TOKEN": config.gitlab.personalAccessToken,
    };
};

export const getGitlabHttpParams = (pageNumber?: number): GitlabHttpParams => {
    return {
        scope: "all",
        state: "all",
        order_by: "updated_at",
        updated_before: config.endDate.toISOString(),
        updated_after: config.startDate.toISOString(),
        per_page: MAX_RESULTS_PER_PAGE,
        page: pageNumber ?? 1,
    };
};

const handleErrorResponse = (response: GaxiosError): void => {
    const baseErrorMessage = `Gitlab responded with ${response?.code ?? response.message}`;

    if (response?.code === "ENOTFOUND") {
        throw Error(`${baseErrorMessage}, which likely means that your baseUrl (${config.gitlab.baseURL}) is invalid`);
    } else if (response.response?.status === 401) {
        throw Error(`${baseErrorMessage}, which likely means that your personal access token is invalid`);
    } else {
        throw Error(baseErrorMessage);
    }
};

const fetchGitlabPullRequestDataByPage = async (pageNumber: number): Promise<GitlabPullRequestData[]> => {
    let pullRequestLookupResponse: GaxiosResponse<GitlabPullRequestData[]> | undefined;

    await request<GitlabPullRequestData[]>({
        baseUrl: config.gitlab.baseURL,
        url: PULL_REQUEST_LOOKUP_PATH,
        method: "GET",
        params: getGitlabHttpParams(pageNumber),
        headers: getGitlabHttpHeaders(),
        timeout: config.httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<GitlabPullRequestData[]>) => (pullRequestLookupResponse = response))
        .catch((response: GaxiosError<GitlabPullRequestData>) => handleErrorResponse(response));

    return pullRequestLookupResponse?.data ?? [];
};

export const fetchGitlabPullRequestNoteData = async (projectID: number, pullRequestID: number): Promise<GitlabPullRequestNoteData[]> => {
    let pullRequestNotesLookupResponse: GaxiosResponse<GitlabPullRequestNoteData[]> | undefined;

    await request<GitlabPullRequestNoteData[]>({
        baseUrl: config.gitlab.baseURL,
        url: `${PROJECT_LOOKUP_PATH}/${projectID}/merge_requests/${pullRequestID}/notes`,
        method: "GET",
        headers: getGitlabHttpHeaders(),
        timeout: config.httpTimeoutInMS,
        retry: true,
    })
        .then((response: GaxiosResponse<GitlabPullRequestNoteData[]>) => {
            pullRequestNotesLookupResponse = response;
        })
        .catch((response: GaxiosError<GitlabPullRequestNoteData[]>) => handleErrorResponse(response));

    return pullRequestNotesLookupResponse?.data ?? [];
};

export const fetchAllGitlabPullRequestData = async (): Promise<GitlabPullRequestData[]> => {
    let pullRequestsData: GitlabPullRequestData[] = [];

    for (let pageNumber = 1; pageNumber <= MAX_LOOKUP_CALLS; pageNumber++) {
        const lookupResults: GitlabPullRequestData[] = await fetchGitlabPullRequestDataByPage(pageNumber);
        pullRequestsData = pullRequestsData.concat(lookupResults);

        const noMoreResults: boolean = lookupResults.length < MAX_RESULTS_PER_PAGE;
        if (noMoreResults) {
            break;
        }
    }

    return pullRequestsData;
};
