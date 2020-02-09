import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";
import { RepositoryIssue } from "../../github_provider";

export default class BlockedIssuesInsight extends Insight {
    protected id = "blockedIssues";
    protected section = InsightSection.issues;
    protected type = InsightType.text;
    protected title = "Issues marked as Blocked";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const helpWantedIssuesCount = this.getIssuesByLabels(metrics.issues, ["blocked"]);
        return {
            text: `You have ${helpWantedIssuesCount ? helpWantedIssuesCount : "no"} issues marked as blocked.`,
            feel: InsightFeel.neutral
        };
    }

    private getIssuesByLabels(issues: Array<RepositoryIssue>, labels: Array<string>): number {
        return issues.filter((issue) => {
            const labelsIntersection = issue.labels.filter(x => labels.includes(x));
            return labelsIntersection.length > 0;
        }).length;
    }
}
