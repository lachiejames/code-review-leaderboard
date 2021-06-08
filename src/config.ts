import { Config } from "./shared/config.model";
import defaultConfig from "../code-review-leaderboard.config";

let selectedConfig = defaultConfig;

export const getConfig = (): Config => {
    return selectedConfig;
};

export const setConfig = (newConfig: Config): void => {
    selectedConfig = newConfig;
};
