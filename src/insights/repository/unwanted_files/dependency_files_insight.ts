import { InsightType, PartialInsight, InsightFeel } from "../../types";
import { ProviderMetrics } from "../../../provider";
import { findFilesByNames } from "../../../strategies/files";
import { RepositoryInsight } from "../repository_insight";

export default class DependencyFilesInsight extends RepositoryInsight {
    protected id = "dependencyFiles";
    protected type = InsightType.text;
    protected title = "Dependency Files";

    private editorFiles = ["node_modules"];

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const unwantedFiles = findFilesByNames(metrics.contents, this.editorFiles);
        if (unwantedFiles.length > 0) {
            return {
                text: `Found project dependencies: ${unwantedFiles.join(",")}. These files store the project dependencies and should not be committed, dependencies should be imported using the appropriate package manager in each environment.`,
                feel: InsightFeel.negative
            };
        }
        return {
            text: ``,
            feel: InsightFeel.hidden,
        };
    }
}
