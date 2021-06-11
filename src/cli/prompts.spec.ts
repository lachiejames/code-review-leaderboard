import prompts from "prompts";

import { setMockConfig } from "../../test-utils/shared/test-utils";

import {
    getAzureAccessToken,
    getAzureBaseURL,
    getConfigFromCli,
    getEndDate,
    getGitlabAccessToken,
    getGitlabBaseURL,
    getOrganisations,
    getStartDate,
} from "./prompts";

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
