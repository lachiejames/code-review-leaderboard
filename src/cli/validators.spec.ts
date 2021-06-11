import { setMockConfig } from "../../test-utils/shared/test-utils";

import { validateEndDate, validatePersonalAccessToken, validateUrl } from "./validators";

describe("cli config", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("validateEndDate()", () => {
        it("if endDate is after startDate, returns true", async () => {
            const startDate: Date = new Date("2021-04-26");
            const endDate: Date = new Date("2021-05-12");

            expect(validateEndDate(startDate, endDate)).toEqual(true);
        });

        it("if endDate equals startDate, returns true", async () => {
            const startDate: Date = new Date("2021-04-26");
            const endDate: Date = new Date("2021-04-26");

            expect(validateEndDate(startDate, endDate)).toEqual(true);
        });

        it("if endDate is before startDate, returns error message", async () => {
            const startDate: Date = new Date("2021-04-26");
            const endDate: Date = new Date("2021-04-23");

            expect(validateEndDate(startDate, endDate)).toEqual("endDate (23/04/2021) cannot be earlier than startDate (26/04/2021)");
        });
    });

    describe("validateUrl()", () => {
        it("if valid url is entered, returns true", () => {
            expect(validateUrl("https://dev.azure.com/MyOrg")).toEqual(true);
        });

        it("if invalid url is entered, returns error message", () => {
            expect(validateUrl("invalid url")).toEqual("That URL is invalid");
        });

        it("if no url is entered, returns error message", () => {
            expect(validateUrl("")).toEqual("You must enter a URL");
        });
    });

    describe("validatePersonalAccessToken()", () => {
        it("if valid url is entered, returns true", () => {
            expect(validatePersonalAccessToken("5KMzQsQBg5QXenxQ")).toEqual(true);
        });

        it("if invalid url is entered, returns error message", () => {
            expect(validatePersonalAccessToken("invalid token")).toEqual(true);
        });

        it("if no url is entered, returns error message", () => {
            expect(validatePersonalAccessToken("")).toEqual("You must enter your personal access token");
        });
    });
});
