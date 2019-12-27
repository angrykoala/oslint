import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { searchFile } from "../../strategies/files";
import { RepositoryInsight } from "./repository_insight";

export default class ReadmeInsight extends RepositoryInsight {
    protected id = "hasReadme";
    protected type = InsightType.text;
    protected title = "Has Readme?";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const file = searchFile(metrics.contents, /^readme(\.\S+)?/i);
        if (file) {
            return {
                text: `Great! File "${file.name}" found within your project.`,
                feel: InsightFeel.positive,
            };
        }
        return {
            text: `Readme file not found within your project. This file should contain basic information about your project as well as important documentation.`,
            feel: InsightFeel.negative,
        };
    }
}
