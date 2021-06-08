import { setConfig } from "../../src/config";

export const setMockConfig = (): void => {
    setConfig({
        startDate: new Date("2021-04-26"),
        endDate: new Date("2021-05-07"),
        azure: {
            enabled: true,
            baseURL: "https://dev.azure.com/MyOrg",
            personalAccessToken: "abc123",
        },
        gitlab: {
            enabled: true,
            baseURL: "https://gitlab.example.com/",
            personalAccessToken: "abc123",
        },
        httpTimeoutInMS: 5000,
    });
};
