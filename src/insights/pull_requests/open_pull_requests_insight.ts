import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";

export default class OpenPullRequestsInsight extends Insight {
    protected id = "openPullRequests";
    protected section = "Pull Requests";
    protected type = InsightType.text;
    protected title = "Open Pull Requests";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const pullRequestsCount = metrics.pullRequests.length;
        if (pullRequestsCount > 30) {
            return {
                text: `You have ${pullRequestsCount} open Pull Requests. Consider removing old, invalid or uncompleter PRs.`,
                feel: InsightFeel.warning,
            };
        } else if (pullRequestsCount > 0) {
            return {
                text: `You have ${pullRequestsCount} open Pull Requests.`,
                feel: InsightFeel.warning,
            };
        } else {
            return {
                text: "You don't have open Pull Requests.",
                feel: InsightFeel.neutral,
            };
        }
    }
}
