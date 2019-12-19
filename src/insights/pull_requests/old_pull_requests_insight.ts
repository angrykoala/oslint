import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { PullRequest } from "../../github_provider";
import { getDaysSinceDate } from "../../utils";

const pullRequestExpirationDays = 10;

export default class OldPullRequestsInsight extends Insight {
    protected id = "oldPullRequests";
    protected section = "Pull Requests";
    protected type = InsightType.text;
    protected title = "Old Pull Requests";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const oldPullRequests = this.getExpiredPullRequests(metrics.pullRequests);

        if (oldPullRequests.length >= 1) {
            return {
                text: `You have ${oldPullRequests.length} outdated Pull Requests. Consider reviewing or closing old Pull Requests as soon as possible to ensure a good experience for contributors.`,
                feel: InsightFeel.negative,
                links: oldPullRequests.map(pr => {
                    return {
                        url: pr.url,
                        text: `#${pr.number} - ${pr.title}`
                    };
                })
            };
        }
        return {
            text: `All your PRs are up-to-date`,
            feel: InsightFeel.positive
        };
    }

    private getExpiredPullRequests(pullRequests: Array<PullRequest>): Array<PullRequest> {
        return pullRequests.filter((pr) => {
            const daysSincePr = getDaysSinceDate(pr.updatedAt);
            return daysSincePr > pullRequestExpirationDays;
        });
    }

}
