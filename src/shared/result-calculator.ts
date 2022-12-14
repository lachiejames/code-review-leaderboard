import { format } from "date-fns";
import { TableUserConfig, table } from "table";

import { getConfig } from "../config";
import { NoteType } from "../shared/note-type.enum";
import { Result } from "../shared/result.model";

import { PullRequest } from "./pull-request.model";
import { logCalculationComplete, logCalculationStart } from "./shared-logger";

const TABLE_HEADINGS: string[] = ["Name", "Pull Requests", "Comments", "Approvals"];

const formatDate = (date: Date): string => {
    return format(date, "dd/MM/yyyy");
};

const getTableConfig = (): TableUserConfig => {
    return {
        columnDefault: {
            alignment: "center",
        },
        header: {
            content: `CODE REVIEW LEADERBOARD\n\n${formatDate(getConfig().startDate)} - ${formatDate(getConfig().endDate)}`,
        },
    };
};

const getUniqueNames = (pullRequests: PullRequest[]): string[] => {
    return [...new Set(pullRequests.map((pullRequest) => pullRequest.authorName))];
};

export const calculateResults = (pullRequests: PullRequest[]): Result[] => {
    logCalculationStart();

    const uniqueNames: string[] = getUniqueNames(pullRequests);
	
	// Added list of allowed names in config to filter users
	const allowedNames = getConfig().users;
	var filteredNames = [];
	if (allowedNames.length === 0) {
		filteredNames = uniqueNames;
	}
	else {
		filteredNames = uniqueNames.filter(item => allowedNames.includes(item));
	}	
	
    const results: Result[] = filteredNames.map((name: string) => new Result(name));

    for (const result of results) {
        for (const pullRequest of pullRequests) {
            if (pullRequest.authorName === result.name) {
                result.numPullRequests++;
            }

            for (const note of pullRequest.notes) {
                if (note.authorName === result.name && note.noteType === NoteType.Approval) {
                    result.numApprovals++;
                } else if (note.authorName === result.name && note.noteType === NoteType.Comment) {
                    result.numComments++;
                }
            }
        }
    }

    logCalculationComplete();

    return results;
};

export const sortResults = (results: Result[]): Result[] => {
    return results.sort(
        (result1: Result, result2: Result) =>
            result2.numApprovals - result1.numApprovals ||
            result2.numComments - result1.numComments ||
            result2.numPullRequests - result1.numPullRequests ||
            result1.name.localeCompare(result2.name),
    );
};

export const createResultsTable = (results: Result[]): (number | string)[][] => {
    const tableResults: (number | string)[][] = [];
    tableResults.push(TABLE_HEADINGS);

    results.forEach((result: Result) => {
        tableResults.push([result.name, result.numPullRequests, result.numComments, result.numApprovals]);
    });

    return tableResults;
};

export const logResults = (tableResults: (number | string)[][]): void => {
    const tableOfResults: string = table(tableResults, getTableConfig());
    console.log(tableOfResults);
};
