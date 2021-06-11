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

export const validateEndDate = (startDate: Date, endDate: Date): string | boolean => {
    if (isBefore(endDate, startDate)) {
        const startDateString = format(startDate, "dd/MM/yyyy");
        const endDateString = format(endDate, "dd/MM/yyyy");

        return `endDate (${endDateString}) cannot be earlier than startDate (${startDateString})`;
    } else {
        return true;
    }
};

export const getStartDate = async () => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "date",
        message: "Enter a start date: ",
        initial: new Date(Date.now()),
        mask: "DD-MM-YYYY",
    });

    return promptData[PROMPT_NAME];
};

export const getEndDate = async (startDate: Date) => {
    const datePlus2Weeks = addDays(new Date(startDate), 14);

    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "date",
        message: "Enter an end date: ",
        initial: datePlus2Weeks,
        mask: "DD-MM-YYYY",
        validate: (endDate: Date) => validateEndDate(startDate, endDate),
    });

    return promptData[PROMPT_NAME];
};

export const getOrganisations = async () => {
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

export const getAzureBaseURL = async () => {
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

export const getAzureAccessToken = async () => {
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

export const getGitlabBaseURL = async () => {
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

export const getGitlabAccessToken = async () => {
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

export const getConfigFromCli = async (): Promise<void> => {
    try {
        const startDate: Date = await getStartDate();
        const endDate: Date = await getEndDate(startDate);
        const orgs: string[] = await getOrganisations();
        const azureEnabled = orgs.includes("Azure");
        const gitlabEnabled = orgs.includes("Gitlab");

        overrideConfig({
            startDate: startDate,
            endDate: endDate,
            azure: { ...getConfig().azure, enabled: azureEnabled },
            gitlab: { ...getConfig().gitlab, enabled: gitlabEnabled },
        });

        if (azureEnabled) {
            const azureBaseUrl: string = await getAzureBaseURL();
            const azureAccessToken: string = await getAzureAccessToken();

            overrideConfig({
                azure: {
                    ...getConfig().azure,
                    baseURL: azureBaseUrl,
                    personalAccessToken: azureAccessToken,
                },
            });
        }

        if (gitlabEnabled) {
            const gitlabBaseUrl: string = await getGitlabBaseURL();
            const gitlabAccessToken: string = await getGitlabAccessToken();

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
