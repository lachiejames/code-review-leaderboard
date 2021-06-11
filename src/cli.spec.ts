import { getEndDate, getStartDate, validateEndDate } from "./cli";
import prompts from "prompts";
import { setMockConfig } from "../test-utils/shared/test-utils";
import { stdin } from "process";

describe("cli config", () => {
    beforeEach(() => {
        setMockConfig();
    });

    it("getStartDate() returns the provided date", async () => {
        prompts.inject([new Date("2021-04-26")]);

        const startDate = await getStartDate();
        expect(startDate).toEqual(new Date("2021-04-26"));
    });

    it("getEndDate() returns the provided date", async () => {
        const startDate: Date = new Date("2021-04-26");
        const endDate: Date = new Date("2021-05-12");
        prompts.inject([endDate]);

        expect(await getEndDate(startDate)).toEqual(endDate);
    });

    describe("validateEndDate()", () => {
        it("if endDate is after startDate, returns true", async () => {
            const startDate: Date = new Date("2021-04-26");
            const endDate: Date = new Date("2021-05-12");

            expect(validateEndDate(startDate, endDate)).toEqual(true);
        });

        it("if endDate equals startDate, returns true", async () => {
            const startDate: Date = new Date("2021-04-26");
            const endDate: Date = new Date("2021-04-26");

            expect(validateEndDate(startDate, endDate)).toEqual(true);
        });

        it("if endDate is before startDate, returns error message", async () => {
            const startDate: Date = new Date("2021-04-26");
            const endDate: Date = new Date("2021-04-23");

            expect(validateEndDate(startDate, endDate)).toEqual("endDate (23/04/2021) cannot be earlier than startDate (26/04/2021)");
        });
    });
});
