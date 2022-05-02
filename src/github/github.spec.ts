import { setGithubRequestMocks } from "../../test-utils/github/github-request-mocks";
import { MOCK_PULL_REQUESTS_GITLAB } from "../../test-utils/github/mock-pull-requests";
import { setMockConfig } from "../../test-utils/shared/test-utils";
import { PullRequest } from "../shared/pull-request.model";

import { getGithubPullRequests } from "./github";

describe("github", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("getGithubPullRequests()", () => {
        beforeEach(() => {
            setGithubRequestMocks();
        });

        it("returns expected number of pull requests", async () => {
            const pullRequests: PullRequest[] = await getGithubPullRequests();
            expect(pullRequests.length).toEqual(5);
        });

        it("pull requests contain expected content", async () => {
            const pullRequests: PullRequest[] = await getGithubPullRequests();
            expect(pullRequests).toEqual(MOCK_PULL_REQUESTS_GITLAB);
        });
    });
});
