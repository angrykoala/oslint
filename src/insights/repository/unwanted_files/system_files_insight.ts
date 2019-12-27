import { InsightType, PartialInsight, InsightFeel } from "../../types";
import { ProviderMetrics } from "../../../provider";
import { findFilesByNames } from "../../../strategies/files";
import { RepositoryInsight } from "../repository_insight";

export default class SystemFilesInsight extends RepositoryInsight {
    protected id = "systemFiles";
    protected type = InsightType.text;
    protected title = "System Files";

    private systemFiles = ["Thumbs.db", ".DS_Store", ".fseventsd", "$RECYCLE.BIN"];

    protected execute(metrics: ProviderMetrics): PartialInsight {

        const unwantedFiles = findFilesByNames(metrics.contents, this.systemFiles);
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
