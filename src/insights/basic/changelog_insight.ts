import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { searchFile } from "../../strategies/files";

export default class ChangelogInsight extends Insight {
    protected id = "hasChangelog";
    protected section = "Basic";
    protected type = InsightType.text;
    protected title = "Changelog";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const file = searchFile(metrics.contents, /^changelog(\.\S+)?/i);
        if (file) {
            return {
                text: `The project has a changelog.`,
                feel: InsightFeel.positive
            };
        }
        return {
            text: `There is not a Changelog file in your project. Keep you changes in a place helps with versioning and debugging.`,
            feel: InsightFeel.negative
        };
    }
}
