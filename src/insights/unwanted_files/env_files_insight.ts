import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { findUnwantedFiles } from "../../strategies/files";

export default class EnvFilesInsight extends Insight {
    protected id = "envFiles";
    protected section = "Unwanted Files";
    protected type = InsightType.text;

    private editorFiles = [".env"];

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const title = "Env Files";

        const unwantedFiles = findUnwantedFiles(metrics.contents, this.editorFiles);
        if (unwantedFiles.length > 0) {
            return {
                text: `Found env config files: ${unwantedFiles.join(",")}. These files define the local configuration needed for your project to run and should not be committed as these files may be different in each environment.`,
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
