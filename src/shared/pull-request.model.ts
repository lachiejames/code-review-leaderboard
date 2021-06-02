import { PullRequestNote } from "./pull-request-note.model";

export class PullRequest {
    public readonly authorName: string;
    public notes: PullRequestNote[] = [];

    public constructor(authorName: string, notes?: PullRequestNote[]) {
        this.authorName = authorName;
        this.notes = notes ?? this.notes;
    }
}
