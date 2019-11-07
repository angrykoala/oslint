import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";

export default class OpenIssuesInsight extends Insight {
    protected id = "openIssues";
    protected section = "Issues";
    protected type = InsightType.text;
    protected title = "Open Issues";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const openIssuesCount = metrics.issues.length;

        if (openIssuesCount === 0) {
            return {
                text: "You don't seem to have opened issues, this means potential colaborators don't know how to help",
                feel: InsightFeel.negative,
            };
        }
        if (openIssuesCount >= 100) {
            return {
                text: `You have ${openIssuesCount} open isues. You should consider removing old, duplicate or less important issues. Having too many issues make it harder for contributores to focus on important tasks.`,
                feel: InsightFeel.negative,
            };
        } else {
            return {
                text: `You have ${openIssuesCount} open isues.`,
                feel: InsightFeel.neutral,
            };
        }
    }
}
