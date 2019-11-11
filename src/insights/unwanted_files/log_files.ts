import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { findFilesByExtension } from "../../strategies/files";

export default class LogFilesInsight extends Insight {
    protected id = "logFiles";
    protected section = "Unwanted Files";
    protected type = InsightType.text;
    protected title = "Log Files";

    private logFilesExtensions = ["log"];

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const filenamesByExtension = this.logFilesExtensions.map((extension: string) => {
            return findFilesByExtension(metrics.contents, extension).map(f => f.name);
        })

        const unwantedFiles = ([] as Array<string>).concat(...filenamesByExtension);
        if (unwantedFiles.length > 0) {
            return {
                text: `The following files and directories may be related to log files: ${unwantedFiles.join(",")}. Log files should not be committed as may contain sensitive information about production environments and occupy large ammounts of space.`,
                feel: InsightFeel.negative,
            };
        }
        return {
            text: ``,
            feel: InsightFeel.hidden,
        };
    }
}
