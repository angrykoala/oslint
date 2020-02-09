import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";
import { getIssuesByLabels } from "../../strategies/issues";

export default class BugIssuesInsight extends Insight {
    protected id = "bugIssues";
    protected section = InsightSection.issues;
    protected type = InsightType.text;
    protected title = "Issues marked as Bugs";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const bugsCount = getIssuesByLabels(metrics.issues, ["bug", "critical"]);
        return {
            text: `You have ${bugsCount ? bugsCount : "no"} issues marked as bugs or critical.`,
            feel: bugsCount > 0 ? InsightFeel.negative : InsightFeel.positive
        };
    }
}
