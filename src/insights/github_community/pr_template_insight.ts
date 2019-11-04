import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";

export default class PullRequestTemplateInsight extends Insight {
    protected id = "pullRequestTemplate";
    protected section = "GitHub Community";
    protected type = InsightType.text;

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const title = "Has Pull Request Template?";
        if (metrics.project.community.issueTemplate) {
            return {
                title,
                text: "You have a Pull Request Template. This helps newcomers contribute and improves communication with maintainers.",
                feel: InsightFeel.positive
            };
        }
        return {
            title,
            text: "You don't have a Pull Request Template. A template might motivate collaborators to create PRs and make reviews easier.",
            feel: InsightFeel.negative,
        };
    }
}
