import { InsightType, PartialInsight, InsightFeel } from "../../types";
import { ProviderMetrics } from "../../../provider";
import { findFilesByNames } from "../../../strategies/files";
import { RepositoryInsight } from "../repository_insight";

export default class IDEFilesInsight extends RepositoryInsight {
    protected id = "ideFiles";
    protected type = InsightType.text;
    protected title = "IDE Files";

    private editorFiles = [".vscode", ".idea", ".vs", ".pk", ".pem", ".pub"];

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const unwantedFiles = findFilesByNames(metrics.contents, this.editorFiles);
        if (unwantedFiles.length > 0) {
            return {
                text: `Found IDE config files: ${unwantedFiles.join(",")}. These files might bound your project to certain tools that no all contributors may be used to. Making your project IDE-agnostic may help by letting everyone use their favorite editor.`,
                feel: InsightFeel.negative
            };
        }
        return {
            text: ``,
            feel: InsightFeel.hidden
        };
    }
}
