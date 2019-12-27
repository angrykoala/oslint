import { InsightType, PartialInsight, InsightFeel } from "../../types";
import { ProviderMetrics } from "../../../provider";
import { findFilesByNames } from "../../../strategies/files";
import { RepositoryInsight } from "../repository_insight";

export default class CompiledFilesInsight extends RepositoryInsight {
    protected id = "compiledFiles";
    protected type = InsightType.text;
    protected title = "Compiled Files";

    private compileFolders = [".cache", "dist", "bin"];
    // TODO: extensions .exe, .out .o .jar

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const unwantedFiles = findFilesByNames(metrics.contents, this.compileFolders);
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
