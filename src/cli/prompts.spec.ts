import prompts from "prompts";

import { setMockConfig } from "../../test-utils/shared/test-utils";

import {
    getAzureAccessToken,
    getAzureBaseUrl,
    getConfigFromCli,
    getEndDate,
    getGitlabAccessToken,
    getGitlabBaseUrl,
    getPlatforms,
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

    it("getPlatforms() returns the selected platforms", async () => {
        prompts.inject([["Azure", "Gitlab"]]);
        expect(await getPlatforms()).toEqual(["Azure", "Gitlab"]);
    });

    it("getAzureBaseUrl() returns the provided url", async () => {
        prompts.inject(["https://dev.azure.com/MyOrg"]);
        expect(await getAzureBaseUrl()).toEqual("https://dev.azure.com/MyOrg");
    });

    it("getAzureAccessToken() returns the provided token", async () => {
        prompts.inject(["abc123"]);
        expect(await getAzureAccessToken()).toEqual("abc123");
    });

    it("getGitlabBaseUrl() returns the provided url", async () => {
        prompts.inject(["https://gitlab.example.com/"]);
        expect(await getGitlabBaseUrl()).toEqual("https://gitlab.example.com/");
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
                ["Azure", "Github", "Gitlab"],
                "https://dev.azure.com/MyOrg",
                "abc123",
                "https://github.com/MyOrg",
                "acb132",
                "https://gitlab.example.com/",
                "cba321",
            ]);

            const config = await getConfigFromCli();
            expect(config).toEqual({
                startDate: new Date("2021-04-26"),
                endDate: new Date("2021-05-12"),
                azure: {
                    baseUrl: "https://dev.azure.com/MyOrg",
                    enabled: true,
                    personalAccessToken: "abc123",
                },
                github: {
                    baseUrl: "https://github.com/MyOrg",
                    enabled: true,
                    personalAccessToken: "acb132",
                },
                gitlab: {
                    baseUrl: "https://gitlab.example.com/",
                    enabled: true,
                    personalAccessToken: "cba321",
                },
                httpTimeoutInMS: 5000,
            });
        });
    });
});
