import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";

export default class IssuesWithoutDescriptionInsight extends Insight {
    protected id = "issuesWithoutDescription";
    protected section = InsightSection.issues;
    protected type = InsightType.text;
    protected title = "Issues Without Description";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const issuesWithoutDescription = metrics.issues.filter(i => !i.description);

        if (issuesWithoutDescription.length >= 1) {
            return {
                text: `You have ${issuesWithoutDescription.length} issues without description. Remember that having issues without a proper description may not provide enough context for a contributor to work on these issues.`,
                feel: InsightFeel.negative,
                links: issuesWithoutDescription.map(i => {
                    return {
                        url: i.url,
                        text: `#${i.number}`
                    }
                })
            };
        }

        return {
            text: "",
            feel: InsightFeel.hidden
        };
    }
}
