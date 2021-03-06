import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";
import { getIssuesByLabels } from "../../strategies/issues";

export default class BlockedIssuesInsight extends Insight {
    protected id = "blockedIssues";
    protected section = InsightSection.issues;
    protected type = InsightType.text;
    protected title = "Issues marked as Blocked";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const blockedCount = getIssuesByLabels(metrics.issues, ["blocked"]);
        return {
            text: `You have ${blockedCount ? blockedCount : "no"} issues marked as blocked.`,
            feel: blockedCount > 0 ? InsightFeel.warning : InsightFeel.positive
        };
    }
}
