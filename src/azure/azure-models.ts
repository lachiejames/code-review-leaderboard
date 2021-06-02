export interface AzureHttpHeaders {
    Authorization: string;
}

export interface AzureHttpParams {
    [key: string]: string | number;

    "api-version": number;
    "$top": number;
    "searchCriteria.status": string;
}

interface Project {
    lastUpdateTime: string;
}

interface User {
    displayName: string;
}

export interface AzureComment {
    author: User;

    content: string;

    lastUpdatedDate: string;

    commentType: string;
}

export interface AzureRepository {
    name: string;

    project: Project;
}

export interface AzurePullRequest {
    pullRequestId: number;

    createdBy: User;

    creationDate: string;
}

export interface AzurePullRequestNote {
    lastUpdatedDate: string;
    comments: AzureComment[];
}

export interface AzureRepositoryResponse {
    value: AzureRepository[];
}

export interface AzurePullRequestResponse {
    value: AzurePullRequest[];
}

export interface AzurePullRequestNoteResponse {
    value: AzurePullRequestNote[];
}
