import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";
import { searchFile } from "../../strategies/files";

export default class ContributingInsight extends Insight {
    protected id = "contributing";
    protected section = InsightSection.community;
    protected type = InsightType.text;
    protected title = "Has Contributing Instructions?";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const file = searchFile(metrics.contents, /^contributing(\.\S+)?/i);
        if (file) {
            return {
                text: `Great! File "${file.name}" found within your project.`,
                feel: InsightFeel.positive,
            };
        }
        return {
            text: `Contributing file not found within your project.`,
            feel: InsightFeel.negative,
        };
    }
}
