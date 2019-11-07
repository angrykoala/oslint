import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { findUnwantedFiles } from "../../strategies/files";

export default class CompiledFilesInsight extends Insight {
    protected id = "compiledFiles";
    protected section = "Unwanted Files";
    protected type = InsightType.text;
    protected title = "Compiled Files";

    private editorFiles = [".cache", "dist"];

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const unwantedFiles = findUnwantedFiles(metrics.contents, this.editorFiles);
        if (unwantedFiles.length > 0) {
            return {
                text: `The following files and directories may be related to compiled files: ${unwantedFiles.join(",")}. Compiled files should not be committed as usually take too long to download, may be different for each system and can lead to security issues.`,
                feel: InsightFeel.negative,
            };
        }
        return {
            text: ``,
            feel: InsightFeel.hidden,
        };
    }
}
