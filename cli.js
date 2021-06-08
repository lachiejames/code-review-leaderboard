#!/usr/bin/env node

const { addDays, format, isBefore } = require("date-fns");
const prompts = require("prompts");

const config = require("./code-review-leaderboard.config");
const { run } = require("./lib/src/shared/leaderboard");
const logError = require("./lib/src/shared/shared-logger");

const setStartDate = async () => {
    const results = await prompts({
        name: "value",
        type: "date",
        message: "Enter a start date: ",
        initial: new Date(Date.now()),
        mask: "DD-MM-YYYY",
    });
    config.startDate = results.value;
};

const setEndDate = async () => {
    const datePlus2Weeks = addDays(new Date(config.startDate), 14);

    const results = await prompts({
        name: "value",
        type: "date",
        message: "Enter an end date: ",
        initial: datePlus2Weeks,
        mask: "DD-MM-YYYY",
        validate: (selectedDate) => {
            if (isBefore(selectedDate, config.startDate)) {
                const startDateString = format(config.startDate, "dd/MM/yyyy");
                const endDateString = format(config.endDate, "dd/MM/yyyy");

                return `endDate (${endDateString}) cannot be earlier than startDate (${startDateString})`;
            } else {
                return true;
            }
        },
    });
    config.endDate = results.value;
};

const setOrganisations = async () => {
    const results = await prompts({
        type: "multiselect",
        name: "value",
        message: "Choose your platforms: ",
        choices: [
            { title: "Azure", value: "Azure", selected: true },
            { title: "Gitlab", value: "Gitlab" },
        ],
        instructions: false,
        min: 1,
    });

    config.azure.enabled = results.value.includes("Azure");
    config.gitlab.enabled = results.value.includes("Gitlab");
};

const setAzureBaseURL = async () => {
    const results = await prompts({
        name: "value",
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

    config.azure.baseURL = results.value;
};

const setAzureAccessToken = async () => {
    const results = await prompts({
        name: "value",
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

    config.azure.personalAccessToken = results.value;
};

const setGitlabBaseURL = async () => {
    const results = await prompts({
        name: "value",
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

    config.gitlab.baseURL = results.value;
};

const setGitlabAccessToken = async () => {
    const results = await prompts({
        name: "value",
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
    config.gitlab.personalAccessToken = results.value;
};

const setConfig = async () => {
    try {
        await setStartDate();
        await setEndDate();
        await setOrganisations();

        if (config.azure.enabled) {
            await setAzureBaseURL();
            await setAzureAccessToken();
        }

        if (config.gitlab.enabled) {
            await setGitlabBaseURL();
            await setGitlabAccessToken();
        }
    } catch (error) {
        logError(error);
    }
};

const doStuff = async () => {
    await setConfig();
    await run();
};

doStuff();
