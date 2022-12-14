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
	name : string;
    lastUpdateTime: string;
}

interface User {
    displayName: string;
}

interface Committer {
	name : string;
	date : string;
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

export interface AzureCommit {
    commitId: number;
    committer: Committer;
}

export interface AzurePush {
    pushId: number;
	date : string;
    pushedBy: User;
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

export interface AzureCommitResponse {
    value: AzureCommit[];
}

export interface AzurePushResponse {
    value: AzurePush[];
}

export interface AzurePullRequestNoteResponse {
    value: AzurePullRequestNote[];
}
