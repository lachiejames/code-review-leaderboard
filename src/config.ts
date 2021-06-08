import defaultConfig from "../code-review-leaderboard.config";

import { Config } from "./shared/config.model";

let selectedConfig: Config = defaultConfig;

export const getConfig = (): Config => {
    return selectedConfig;
};

export const setConfig = (newConfig: Config): void => {
    selectedConfig = newConfig;
};
