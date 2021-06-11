import {
    getAzureAccessToken,
    getAzureBaseURL,
    getConfigFromCli,
    getEndDate,
    getGitlabAccessToken,
    getGitlabBaseURL,
    getOrganisations,
    getStartDate,
    validateEndDate,
    validatePersonalAccessToken,
    validateUrl,
} from "./cli";
import prompts from "prompts";
import { setMockConfig } from "../test-utils/shared/test-utils";

describe("cli config", () => {
    beforeEach(() => {
        setMockConfig();
    });

    it("getStartDate() returns the provided date", async () => {
        prompts.inject([new Date("2021-04-26")]);

        const startDate = await getStartDate();
        expect(startDate).toEqual(new Date("2021-04-26"));
    });

    // Ideally I would be testing the prompt validator using getEndDate(), but the validators do not run during tests
    it("getEndDate() returns the provided date", async () => {
        const startDate: Date = new Date("2021-04-26");
        const endDate: Date = new Date("2021-05-12");
        prompts.inject([endDate]);

        expect(await getEndDate(startDate)).toEqual(endDate);
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

    it("getOrganisations() returns the selected organisations", async () => {
        prompts.inject([["Azure", "Gitlab"]]);
        expect(await getOrganisations()).toEqual(["Azure", "Gitlab"]);
    });

    it("getAzureBaseURL() returns the provided url", async () => {
        prompts.inject(["https://dev.azure.com/MyOrg"]);
        expect(await getAzureBaseURL()).toEqual("https://dev.azure.com/MyOrg");
    });

    it("getAzureAccessToken() returns the provided token", async () => {
        prompts.inject(["abc123"]);
        expect(await getAzureAccessToken()).toEqual("abc123");
    });

    it("getGitlabBaseURL() returns the provided url", async () => {
        prompts.inject(["https://gitlab.example.com/"]);
        expect(await getGitlabBaseURL()).toEqual("https://gitlab.example.com/");
    });

    it("getGitlabAccessToken() returns the provided url", async () => {
        prompts.inject(["cba321"]);
        expect(await getGitlabAccessToken()).toEqual("cba321");
    });

    describe("getConfigFromCli()", () => {
        it("returns a config based on the provided values", async () => {
            prompts.inject([
                new Date("2021-04-26"),
                new Date("2021-05-12"),
                ["Azure", "Gitlab"],
                "https://dev.azure.com/MyOrg",
                "abc123",
                "https://gitlab.example.com/",
                "cba321",
            ]);

            const config = await getConfigFromCli();
            expect(config).toEqual({
                startDate: new Date("2021-04-26"),
                endDate: new Date("2021-05-12"),
                azure: {
                    baseURL: "https://dev.azure.com/MyOrg",
                    enabled: true,
                    personalAccessToken: "abc123",
                },
                gitlab: {
                    baseURL: "https://gitlab.example.com/",
                    enabled: true,
                    personalAccessToken: "cba321",
                },
                httpTimeoutInMS: 5000,
            });
        });
    });
});
