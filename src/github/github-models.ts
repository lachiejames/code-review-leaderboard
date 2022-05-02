export interface GithubHttpHeaders {
    "PRIVATE-TOKEN": string;
}

export interface GithubHttpParams {
    [key: string]: string | number;

    scope: string;
    state: string;
    order_by: string;
    updated_before: string;
    updated_after: string;
    per_page: number;
    page: number;
}

export interface GithubPullRequestData {
    iid: number;

    project_id: number;

    updated_at: string;

    user_notes_count: number;

    author: GithubUserData;
}

export interface GithubPullRequestNoteData {
    body: string;

    author: GithubUserData;

    updated_at: string;

    resolvable: boolean;
}

export interface GithubUserData {
    name: string;
}
