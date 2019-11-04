import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { searchFile } from "../../strategies/files";

export default class ReadmeInsight extends Insight {
    protected id = "hasReadme";
    protected section = "Basic";
    protected type = InsightType.text;

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const title = "Has Readme?";
        const file = searchFile(metrics.contents, /^readme(\.\S+)?/i);
        if (file) {
            return {
                text: `Great! File "${file.name}" found within your project.`,
                feel: InsightFeel.positive,
                title
            };
        }
        return {
            text: `Readme file not found within your project. This file should contain basic information about your project as well as important documentation.`,
            feel: InsightFeel.negative,
            title
        };
    }
}
