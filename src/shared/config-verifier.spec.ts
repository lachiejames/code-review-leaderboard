import { overrideConfig, setMockConfig } from "../../test-utils/shared/test-utils";
import { getConfig } from "../config";

import { verifyConfig } from "./config-verifier";

describe("config verifier", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("dates", () => {
        it("if startDate is before endDate, NO error is thrown", () => {
            expect(() => verifyConfig()).not.toThrowError();
        });

        it("if endDate is before startDate, an error is thrown", () => {
            overrideConfig({ startDate: new Date("2030-01-01") });
            expect(() => verifyConfig()).toThrowError("endDate (07/05/2021) cannot be earlier than startDate (01/01/2030)");
        });
    });

    describe("azure", () => {
        it("if baseUrl and personalAccessToken are not empty strings, NO error is thrown", () => {
            expect(() => verifyConfig()).not.toThrowError();
        });

        it("if baseUrl='', an error is thrown", () => {
            overrideConfig({ azure: { ...getConfig().azure, baseURL: "" } });
            expect(() => verifyConfig()).toThrowError("Azure pull requests are enabled, but you have not set a base URL");
        });

        it("if personalAccessToken='', an error is thrown", () => {
            overrideConfig({ azure: { ...getConfig().azure, personalAccessToken: "" } });
            expect(() => verifyConfig()).toThrowError("Azure pull requests are enabled, but you have not set a personal access token");
        });

        it("if enabled=false, and config is invalid, NO error is thrown", () => {
            overrideConfig({
                azure: {
                    enabled: false,
                    baseURL: "",
                    personalAccessToken: "",
                },
            });
            expect(() => verifyConfig()).not.toThrowError();
        });
    });

    describe("gitlab", () => {
        it("if baseUrl and personalAccessToken are not empty strings, NO error is thrown", () => {
            expect(() => verifyConfig()).not.toThrowError();
        });

        it("if baseUrl='', an error is thrown", () => {
            overrideConfig({ gitlab: { ...getConfig().gitlab, baseURL: "" } });
            expect(() => verifyConfig()).toThrowError("Gitlab pull requests are enabled, but you have not set a base URL");
        });

        it("if personalAccessToken='', an error is thrown", () => {
            overrideConfig({ gitlab: { ...getConfig().gitlab, personalAccessToken: "" } });
            expect(() => verifyConfig()).toThrowError("Gitlab pull requests are enabled, but you have not set a personal access token");
        });

        it("if enabled=false, and config is invalid, NO error is thrown", () => {
            overrideConfig({
                gitlab: {
                    enabled: false,
                    baseURL: "",
                    personalAccessToken: "",
                },
            });
            expect(() => verifyConfig()).not.toThrowError();
        });
    });
});
