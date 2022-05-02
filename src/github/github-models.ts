export interface GithubHttpHeaders {
    Authorization: string;
}

export interface GithubHttpParams {
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

export interface GithubComment {
    author: User;

    content: string;

    lastUpdatedDate: string;

    commentType: string;
}

export interface GithubRepository {
    name: string;

    project: Project;
}

export interface GithubPullRequest {
    pullRequestId: number;

    createdBy: User;

    creationDate: string;
}

export interface GithubPullRequestNote {
    lastUpdatedDate: string;
    comments: GithubComment[];
}

export interface GithubRepositoryResponse {
    value: GithubRepository[];
}

export interface GithubPullRequestResponse {
    value: GithubPullRequest[];
}

export interface GithubPullRequestNoteResponse {
    value: GithubPullRequestNote[];
}
