import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";

export default class IssueTemplateInsight extends Insight {
    protected id = "issueTemplate";
    protected section = InsightSection.community;
    protected type = InsightType.text;
    protected title = "Has Issue Template?";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        if (metrics.project.community.issueTemplate) {
            return {
                text: "You have an Issue Template. This helps newcomers to contribute and contact maintainers.",
                feel: InsightFeel.positive
            };
        }
        return {
            text: "You don't have an Issue Template. A template might help collaborators following the project processes and increase Issues quality.",
            feel: InsightFeel.negative,
        };
    }
}
