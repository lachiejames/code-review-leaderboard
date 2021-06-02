import { setAzureRequestMocks } from "../../test-utils/azure/azure-request-mocks";
import { MOCK_PULL_REQUESTS_AZURE } from "../../test-utils/azure/mock-pull-requests";
import { setMockConfig } from "../../test-utils/shared/test-utils";
import { PullRequest } from "../shared/pull-request.model";

import { getAzurePullRequests } from "./azure";

describe("azure", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("getAzurePullRequests()", () => {
        beforeEach(() => {
            setAzureRequestMocks();
        });

        it("returns expected number of pull requests", async () => {
            const pullRequests: PullRequest[] = await getAzurePullRequests();
            expect(pullRequests.length).toEqual(6);
        });

        it("pull requests contain expected content", async () => {
            const pullRequests: PullRequest[] = await getAzurePullRequests();
            expect(pullRequests).toEqual(MOCK_PULL_REQUESTS_AZURE);
        });
    });
});
