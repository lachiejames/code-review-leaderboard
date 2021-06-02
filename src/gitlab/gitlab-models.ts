export interface GitlabHttpHeaders {
    "PRIVATE-TOKEN": string;
}

export interface GitlabHttpParams {
    [key: string]: string | number;

    scope: string;
    state: string;
    order_by: string;
    updated_before: string;
    updated_after: string;
    per_page: number;
    page: number;
}

export interface GitlabPullRequestData {
    iid: number;

    project_id: number;

    updated_at: string;

    user_notes_count: number;

    author: GitlabUserData;
}

export interface GitlabPullRequestNoteData {
    body: string;

    author: GitlabUserData;

    updated_at: string;

    resolvable: boolean;
}

export interface GitlabUserData {
    name: string;
}
