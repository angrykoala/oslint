import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { PullRequest } from "../../github_provider";

const pullRequestExpirationDays = 10;

export default class OldPullRequestsInsight extends Insight {
    protected id = "oldPullRequests";
    protected section = "Pull Requests";
    protected type = InsightType.text;
    protected title = "Old Pull Requests";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const oldPullRequestsCount = this.getExpiredPullRequests(metrics.pullRequests);

        if (oldPullRequestsCount >= 1) {
            return {
                text: `You have ${oldPullRequestsCount} outdated Pull Requests. Consider reviewing or closing old Pull Requests as soon as possible to ensure a good experience for contributors.`,
                feel: InsightFeel.negative
            };
        }
        return {
            text: `All your PRs are up-to-date`,
            feel: InsightFeel.positive
        };
    }

    private getExpiredPullRequests(pullRequests: Array<PullRequest>): number {
        const daysToTimestamp = 86400000;
        const filterTimestamp = new Date().getTime() - (pullRequestExpirationDays * daysToTimestamp);
        return pullRequests.filter((pr) => {
            return pr.updatedAt.getTime() < filterTimestamp;
        }).length;
    }

}
