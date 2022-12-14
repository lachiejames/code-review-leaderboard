export class Result {
    public name: string;
    public numPullRequests = 0;
    public numComments = 0;
    public numApprovals = 0;
	public numCommits = 0;
	public numPushes = 0;

    public constructor(name: string, numPullRequests?: number, numComments?: number, numApprovals?: number, numCommits?: number, numPushes?: number) {
        this.name = name;
        this.numPullRequests = numPullRequests ?? this.numPullRequests;
        this.numComments = numComments ?? this.numComments;
        this.numApprovals = numApprovals ?? this.numApprovals;
		this.numCommits = numCommits ?? this.numCommits;		
		this.numPushes = numPushes ?? this.numPushes;	
    }
}
