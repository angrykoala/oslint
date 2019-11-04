import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { findUnwantedFiles } from "../../strategies/files";

export default class DependencyFilesInsight extends Insight {
    protected id = "dependencyFiles";
    protected section = "Unwanted Files";
    protected type = InsightType.text;

    private editorFiles = ["node_modules"];

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const title = "Dependency Files";

        const unwantedFiles = findUnwantedFiles(metrics.contents, this.editorFiles);
        if (unwantedFiles.length > 0) {
            return {
                text: `Found project dependencies: ${unwantedFiles.join(",")}. These files store the project dependencies and should not be committed, dependencies should be imported using the appropriate package manager in each environment.`,
                feel: InsightFeel.negative,
                title
            };
        }
        return {
            text: ``,
            feel: InsightFeel.hidden,
            title
        };
    }
}
