import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { RepositoryIssue } from "../../github_provider";

export default class HelpWantedIssuesInsight extends Insight {
    protected id = "helpWanterIssues";
    protected section = "Issues";
    protected type = InsightType.text;
    protected title = "Issues With Help Wanted Labels";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const helpWantedIssuesCount = this.getIssuesByLabels(metrics.issues, ["help wanted", "good first issue"]);
        return {
            text: `You have ${helpWantedIssuesCount ? helpWantedIssuesCount : "no"} issues with some label indicating you are looking for help. These labels help contributors focus on tasks that are simple enough and useful.`,
            feel: helpWantedIssuesCount > 0 ? InsightFeel.positive : InsightFeel.negative
        };
    }

    private getIssuesByLabels(issues: Array<RepositoryIssue>, labels: Array<string>): number {
        return issues.filter((issue) => {
            const labelsIntersection = issue.labels.filter(x => labels.includes(x));
            return labelsIntersection.length > 0;
        }).length;
    }
}
