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
        message: "Choose a start date: ",
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
        message: "Choose an end date: ",
        initial: datePlus2Weeks,
        mask: "DD-MM-YYYY",
        validate: (endDate: Date) => validateEndDate(startDate, endDate),
    });

    return promptData[PROMPT_NAME];
};

export const getPlatforms = async (): Promise<string[]> => {
    const promptData: Answers<PromptType> = await prompts({
        type: "multiselect",
        name: PROMPT_NAME,
        message: "Select your platforms: ",
        choices: [
            { title: "Azure", value: "Azure", selected: true },
            { title: "Gitlab", value: "Gitlab" },
        ],
        instructions: false,
        min: 1,
    });

    return promptData[PROMPT_NAME];
};

export const getAzureBaseUrl = async (): Promise<string> => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Azure organisation's base Url: ",
        validate: (url: string) => validateUrl(url),
    });

    return promptData[PROMPT_NAME];
};

export const getAzureAccessToken = async (): Promise<string> => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Azure personal access token: ",
        validate: (token: string) => validatePersonalAccessToken(token),
    });

    return promptData[PROMPT_NAME];
};

export const getGitlabBaseUrl = async (): Promise<string> => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Gitlab organisation's base Url: ",
        validate: (url: string) => validateUrl(url),
    });

    return promptData[PROMPT_NAME];
};

export const getGitlabAccessToken = async (): Promise<string> => {
    const promptData: Answers<PromptType> = await prompts({
        name: PROMPT_NAME,
        type: "text",
        message: "Enter your Gitlab personal access token: ",
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
            baseUrl: "",
            personalAccessToken: "",
        },
        github: {
            enabled: false,
            baseUrl: "",
            personalAccessToken: "",
        },
        gitlab: {
            enabled: false,
            baseUrl: "",
            personalAccessToken: "",
        },
        httpTimeoutInMS: 5000,
    };
};

export const getConfigFromCli = async (): Promise<Config> => {
    const config: Config = getEmptyConfig();

    config.startDate = await getStartDate();
    config.endDate = await getEndDate(config.startDate);

    const platforms: string[] = await getPlatforms();
    config.azure.enabled = platforms.includes("Azure");
    config.gitlab.enabled = platforms.includes("Gitlab");

    if (config.azure.enabled) {
        config.azure.baseUrl = await getAzureBaseUrl();
        config.azure.personalAccessToken = await getAzureAccessToken();
    }

    if (config.gitlab.enabled) {
        config.gitlab.baseUrl = await getGitlabBaseUrl();
        config.gitlab.personalAccessToken = await getGitlabAccessToken();
    }

    return config;
};
