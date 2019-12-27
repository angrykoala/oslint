import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";

export default class PullRequestTemplateInsight extends Insight {
    protected id = "pullRequestTemplate";
    protected section = InsightSection.community;
    protected type = InsightType.text;
    protected title = "Has Pull Request Template?";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        if (metrics.project.community.issueTemplate) {
            return {
                text: "You have a Pull Request Template. This helps newcomers contribute and improves communication with maintainers.",
                feel: InsightFeel.positive
            };
        }
        return {
            text: "You don't have a Pull Request Template. A template might motivate collaborators to create PRs and make reviews easier.",
            feel: InsightFeel.negative,
        };
    }
}
