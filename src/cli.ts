#!/usr/bin/env node

import { getConfigFromCli } from "./cli/prompts";
import { setConfig } from "./config";
import { run } from "./shared/leaderboard";

getConfigFromCli().then((config) => {
    setConfig(config);
    run();
});
