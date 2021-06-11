import { format, isBefore } from "date-fns";
import urlRegex from "url-regex";

export const validateEndDate = (startDate: Date, endDate: Date): string | boolean => {
    if (isBefore(endDate, startDate)) {
        const startDateString = format(startDate, "dd/MM/yyyy");
        const endDateString = format(endDate, "dd/MM/yyyy");

        return `endDate (${endDateString}) cannot be earlier than startDate (${startDateString})`;
    } else {
        return true;
    }
};

export const validateUrl = (url: string): string | boolean => {
    const isValidUrl: boolean = urlRegex().test(url);
    const isEmptyUrl: boolean = url.length === 0;

    if (isValidUrl) {
        return true;
    } else if (isEmptyUrl) {
        return "You must enter a URL";
    } else {
        return "That URL is invalid";
    }
};

export const validatePersonalAccessToken = (token: string): string | boolean => {
    const isEmptyString: boolean = token.length === 0;

    if (isEmptyString) {
        return "You must enter your personal access token";
    } else {
        return true;
    }
};
