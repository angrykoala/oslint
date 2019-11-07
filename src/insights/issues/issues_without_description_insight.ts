import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";

export default class IssuesWithoutDescriptionInsight extends Insight {
    protected id = "issuesWithoutDescription";
    protected section = "Issues";
    protected type = InsightType.text;
    protected title = "Issues Without Description";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const issuesWithoutDescriptionCount = metrics.issues.filter(i => !i.description).length;

        if (issuesWithoutDescriptionCount >= 1) {
            return {
                text: `You have ${issuesWithoutDescriptionCount} issues without description. Remember that having issues without a proper description may not provide enough context for a contributor to work on these issues.`,
                feel: InsightFeel.negative
            };
        }

        return {
            text: "",
            feel: InsightFeel.hidden
        };
    }
}
