import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { searchFile } from "../../strategies/files";

export default class ContributingInsight extends Insight {
    protected id = "contributing";
    protected section = "GitHub Community";
    protected type = InsightType.text;

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const title = "Has Contributing Information?";
        const file = searchFile(metrics.contents, /^contributing(\.\S+)?/i);
        if (file) {
            return {
                text: `Great! File "${file.name}" found within your project.`,
                feel: InsightFeel.positive,
                title
            };
        }
        return {
            text: `Contributing file not found within your project.`,
            feel: InsightFeel.negative,
            title
        };
    }
}
