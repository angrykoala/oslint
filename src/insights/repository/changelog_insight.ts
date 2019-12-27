import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { searchFile } from "../../strategies/files";
import { RepositoryInsight } from "./repository_insight";

export default class ChangelogInsight extends RepositoryInsight {
    protected id = "hasChangelog";
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
