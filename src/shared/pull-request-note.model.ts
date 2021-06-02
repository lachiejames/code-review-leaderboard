import { NoteType } from "./note-type.enum";

export class PullRequestNote {
    public authorName: string;
    public noteType: NoteType;

    public constructor(authorName: string, noteType: NoteType) {
        this.authorName = authorName;
        this.noteType = noteType;
    }
}
