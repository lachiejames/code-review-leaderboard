export interface GithubHttpHeaders {
    Authorization: string;
}

export interface GithubHttpParams {
    [key: string]: string | number;

    state: string;

    page: number;

    per_page: number;

    sort: string;
}

interface User {
    login: string;
}

export interface GithubComment {
    author: User;

    content: string;

    lastUpdatedDate: string;

    commentType: string;
}

export interface GithubRepository {
    name: string;

    updated_at: string;
}

export interface GithubPullRequest {
    number: number;

    state: string;

    user: User;

    updated_at: string;

    merged_at: string;
}

export interface GithubPullRequestNote {
    lastUpdatedDate: string;
    comments: GithubComment[];
}

export type GithubRepositoryResponse = GithubRepository[];

export type GithubPullRequestResponse = GithubPullRequest[];

export type GithubPullRequestNoteResponse = GithubPullRequestNote[];
