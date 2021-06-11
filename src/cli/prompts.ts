import { addDays } from "date-fns";
import prompts, { Answers } from "prompts";

import { Config } from "../shared/config.model";

import { validateEndDate, validatePersonalAccessToken, validateUrl } from "./validators";

// `prompts` package uses generics which accepts string literal values and then uses those values as types
// This means I have to ensure I use a string literal type that matches a string literal value
const PROMPT_NAME = "value";
type PromptType = "value";

export const getStartDate = async (): Promise<Date> => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "date",
        message: "Enter a start date: ",
        initial: new Date(Date.now()),
        mask: "DD-MM-YYYY",
    });

    return promptData[PROMPT_NAME];
};

export const getEndDate = async (startDate: Date): Promise<Date> => {
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

export const getOrganisations = async (): Promise<string[]> => {
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

export const getAzureBaseURL = async (): Promise<string> => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Azure organisation's base URL: ",
        hint: "e.g. https://dev.azure.com/myOrg/",
        validate: (url: string) => validateUrl(url),
    });

    return promptData[PROMPT_NAME];
};

export const getAzureAccessToken = async (): Promise<string> => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Azure personal access token: ",
        hint: "e.g. 3Ccz4G6QPilk",
        validate: (token: string) => validatePersonalAccessToken(token),
    });

    return promptData[PROMPT_NAME];
};

export const getGitlabBaseURL = async (): Promise<string> => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Gitlab organisation's base URL: ",
        hint: "e.g. https://gitlab.example.com/",
        validate: (url: string) => validateUrl(url),
    });

    return promptData[PROMPT_NAME];
};

export const getGitlabAccessToken = async (): Promise<string> => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Gitlab personal access token: ",
        hint: "e.g. Hf4sXcfn7M69",
        validate: (token: string) => validatePersonalAccessToken(token),
    });

    return promptData[PROMPT_NAME];
};

const getEmptyConfig = (): Config => {
    return {
        startDate: new Date(),
        endDate: new Date(),
        azure: {
            enabled: false,
            baseURL: "",
            personalAccessToken: "",
        },
        gitlab: {
            enabled: false,
            baseURL: "",
            personalAccessToken: "",
        },
        httpTimeoutInMS: 5000,
    };
};

export const getConfigFromCli = async (): Promise<Config> => {
    const config: Config = getEmptyConfig();

    config.startDate = await getStartDate();
    config.endDate = await getEndDate(config.startDate);

    const orgs: string[] = await getOrganisations();
    config.azure.enabled = orgs.includes("Azure");
    config.gitlab.enabled = orgs.includes("Gitlab");

    if (config.azure.enabled) {
        config.azure.baseURL = await getAzureBaseURL();
        config.azure.personalAccessToken = await getAzureAccessToken();
    }

    if (config.gitlab.enabled) {
        config.gitlab.baseURL = await getGitlabBaseURL();
        config.gitlab.personalAccessToken = await getGitlabAccessToken();
    }

    return config;
};
