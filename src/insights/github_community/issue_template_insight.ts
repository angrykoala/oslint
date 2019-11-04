import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";

export default class IssueTemplateInsight extends Insight {
    protected id = "issueTemplate";
    protected section = "GitHub Community";
    protected type = InsightType.text;

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const title = "Has Issue Template?";
        if (metrics.project.community.issueTemplate) {
            return {
                title,
                text: "You have an Issue Template. This helps newcomers to contribute and contact maintainers.",
                feel: InsightFeel.positive
            };
        }
        return {
            title,
            text: "You don't have an Issue Template. A template might help collaborators following the project processes and increase Issues quality.",
            feel: InsightFeel.negative,
        };
    }
}
