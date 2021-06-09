import defaultConfig from "../code-review-leaderboard.config";

import { Config } from "./shared/config.model";

let selectedConfig: Config = defaultConfig;

export const getConfig = (): Config => {
    return selectedConfig;
};

export const setConfig = (newConfig: Config): void => {
    selectedConfig = newConfig;
};

export const overrideConfig = (newConfig: Partial<Config>): void => {
    const currentConfig = getConfig();

    const overiddenConfig: Config = {
        ...currentConfig,
        ...newConfig,
        azure: {
            ...currentConfig.azure,
            ...newConfig.azure,
        },
        gitlab: {
            ...currentConfig.gitlab,
            ...newConfig.gitlab,
        },
    };

    setConfig(overiddenConfig);
};
