#!/usr/bin/env node

import { addDays, format, isBefore } from "date-fns";
import prompts, { Answers } from "prompts";
import { getConfig, overrideConfig } from "./config";
import { run } from "./shared/leaderboard";
import { logError } from "./shared/shared-logger";

// `prompts` package uses generics which accepts string literal values and then uses those values as types
// This means I have to ensure I use a string literal type that matches a string literal value
const PROMPT_NAME = "value";
type PromptType = "value";

const setStartDate = async () => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "date",
        message: "Enter a start date: ",
        initial: new Date(Date.now()),
        mask: "DD-MM-YYYY",
    });

    return promptData[PROMPT_NAME];
};

const setEndDate = async (startDate: Date) => {
    const datePlus2Weeks = addDays(new Date(startDate), 14);

    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "date",
        message: "Enter an end date: ",
        initial: datePlus2Weeks,
        mask: "DD-MM-YYYY",
        validate: (endDate) => {
            if (isBefore(endDate, startDate)) {
                const startDateString = format(startDate, "dd/MM/yyyy");
                const endDateString = format(endDate, "dd/MM/yyyy");

                return `endDate (${endDateString}) cannot be earlier than startDate (${startDateString})`;
            } else {
                return true;
            }
        },
    });

    return promptData[PROMPT_NAME];
};

const setOrganisations = async () => {
    const promptData: Answers<PromptType> = await prompts({
        type: "multiselect",
        name: PROMPT_NAME,
        message: "Choose your platforms: ",
        choices: [
            { title: "Azure", value: "Azure", selected: true },
            { title: "Gitlab", value: "Gitlab" },
        ],
        instructions: false,
        min: 1,
    });

    return promptData[PROMPT_NAME];
};

const setAzureBaseURL = async () => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Azure organisation's base URL: ",
        hint: "e.g. https://dev.azure.com/myOrg/",
        validate: (val) => {
            if (val.length === 0) {
                return "You must enter a URL";
            } else {
                return true;
            }
        },
    });

    return promptData[PROMPT_NAME];
};

const setAzureAccessToken = async () => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Azure personal access token: ",
        hint: "e.g. 3Ccz4G6QPilk",
        validate: (val) => {
            if (val.length === 0) {
                return "You must enter a value";
            } else {
                return true;
            }
        },
    });

    return promptData[PROMPT_NAME];
};

const setGitlabBaseURL = async () => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Gitlab organisation's base URL: ",
        hint: "e.g. https://gitlab.example.com/",
        validate: (val) => {
            if (val.length === 0) {
                return "You must enter a value";
            } else {
                return true;
            }
        },
    });

    return promptData[PROMPT_NAME];
};

const setGitlabAccessToken = async () => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Gitlab personal access token: ",
        hint: "e.g. Hf4sXcfn7M69",
        validate: (val) => {
            if (val.length === 0) {
                return "You must enter a value";
            } else {
                return true;
            }
        },
    });

    return promptData[PROMPT_NAME];
};

const getConfigFromCli = async (): Promise<void> => {
    try {
        const startDate: Date = await setStartDate();
        const endDate: Date = await setEndDate(startDate);
        const orgs: string[] = await setOrganisations();
        const azureEnabled = orgs.includes("Azure");
        const gitlabEnabled = orgs.includes("Gitlab");

        overrideConfig({
            startDate: startDate,
            endDate: endDate,
            azure: { ...getConfig().azure, enabled: azureEnabled },
            gitlab: { ...getConfig().gitlab, enabled: gitlabEnabled },
        });

        if (azureEnabled) {
            const azureBaseUrl: string = await setAzureBaseURL();
            const azureAccessToken: string = await setAzureAccessToken();

            overrideConfig({
                azure: {
                    ...getConfig().azure,
                    baseURL: azureBaseUrl,
                    personalAccessToken: azureAccessToken,
                },
            });
        }

        if (gitlabEnabled) {
            const gitlabBaseUrl: string = await setGitlabBaseURL();
            const gitlabAccessToken: string = await setGitlabAccessToken();

            overrideConfig({
                gitlab: {
                    ...getConfig().gitlab,
                    baseURL: gitlabBaseUrl,
                    personalAccessToken: gitlabAccessToken,
                },
            });
        }
    } catch (error) {
        logError(error);
    }
};

getConfigFromCli().then((_) => run());
