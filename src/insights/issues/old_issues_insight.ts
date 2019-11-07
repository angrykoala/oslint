import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { RepositoryIssue } from "../../github_provider";

const issueExpirationDays = 30;

export default class OldIssuesInsight extends Insight {
    protected id = "oldIssues";
    protected section = "Issues";
    protected type = InsightType.text;
    protected title = "Old Issues";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const oldIssuesCount = this.getExpiredIssues(metrics.issues);

        if (oldIssuesCount >= 1) {
            return {
                text: `You have ${oldIssuesCount} outdated Issues. Consider removing old, duplicate or less important issues. Having too many issues make it harder for contributores to focus on important tasks.`,
                feel: InsightFeel.negative
            };
        }
        return {
            text: `You have no outdated issues.`,
            feel: InsightFeel.positive
        };
    }

    private getExpiredIssues(issues: Array<RepositoryIssue>): number {
        const daysToTimestamp = 86400000;
        const filterTimestamp = new Date().getTime() - (issueExpirationDays * daysToTimestamp);
        return issues.filter((i) => {
            return i.updatedAt.getTime() < filterTimestamp;
        }).length;
    }
}
