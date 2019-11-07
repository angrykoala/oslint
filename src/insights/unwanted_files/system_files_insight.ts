import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { findUnwantedFiles } from "../../strategies/files";

export default class SystemFilesInsight extends Insight {
    protected id = "systemFiles";
    protected section = "Unwanted Files";
    protected type = InsightType.text;
    protected title = "System Files";

    private editorFiles = ["Thumbs.db", ".DS_Store", ".fseventsd", "$RECYCLE.BIN"];

    protected execute(metrics: ProviderMetrics): PartialInsight {

        const unwantedFiles = findUnwantedFiles(metrics.contents, this.editorFiles);
        if (unwantedFiles.length > 0) {
            return {
                text: `Found system files: ${unwantedFiles.join(",")}. These files are exclusive of certain systems and might not work properly on different systems.`,
                feel: InsightFeel.negative
            };
        }
        return {
            text: ``,
            feel: InsightFeel.hidden
        };
    }
}
