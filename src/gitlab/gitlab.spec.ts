import { setGitlabRequestMocks } from "../../test-utils/gitlab/gitlab-request-mocks";
import { MOCK_PULL_REQUESTS_GITLAB } from "../../test-utils/gitlab/mock-pull-requests";
import { setMockConfig } from "../../test-utils/shared/test-utils";
import { PullRequest } from "../shared/pull-request.model";

import { getGitlabPullRequests } from "./gitlab";

describe("gitlab", () => {
    beforeEach(() => {
        setMockConfig();
    });

    describe("getGitlabPullRequests()", () => {
        beforeEach(() => {
            setGitlabRequestMocks();
        });

        it("returns expected number of pull requests", async () => {
            const pullRequests: PullRequest[] = await getGitlabPullRequests();
            expect(pullRequests.length).toEqual(5);
        });

        it("pull requests contain expected content", async () => {
            const pullRequests: PullRequest[] = await getGitlabPullRequests();
            expect(pullRequests).toEqual(MOCK_PULL_REQUESTS_GITLAB);
        });
    });
});
