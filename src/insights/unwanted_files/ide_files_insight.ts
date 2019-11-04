import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { findUnwantedFiles } from "../../strategies/files";

export default class IDEFilesInsight extends Insight {
    protected id = "ideFiles";
    protected section = "Unwanted Files";
    protected type = InsightType.text;

    private editorFiles = [".vscode", ".idea", ".vs", ".pk", ".pem", ".pub"];

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const title = "IDE Files";

        const unwantedFiles = findUnwantedFiles(metrics.contents, this.editorFiles);
        if (unwantedFiles.length > 0) {
            return {
                text: `Found IDE config files: ${unwantedFiles.join(",")}. These files might bound your project to certain tools that no all contributors may be used to. Making your project IDE-agnostic may help by letting everyone use their favorite editor.`,
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
