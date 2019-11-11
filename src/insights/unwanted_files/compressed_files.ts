import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { findFilesByExtension } from "../../strategies/files";

export default class CompressedFilesInsight extends Insight {
    protected id = "compressedFiles";
    protected section = "Unwanted Files";
    protected type = InsightType.text;
    protected title = "Compressed Files";

    private compressedFilesExtensions = ['rar', 'zip', 'tar']

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const filenamesByExtension = this.compressedFilesExtensions.map((extension: string) => {
            return findFilesByExtension(metrics.contents, extension).map(f => f.name);
        })

        const filenames = ([] as Array<string>).concat(...filenamesByExtension);

        if (filenames.length > 0) {
            return {
                text: `The following files and directories may be related to compressed files: ${filenames.join(",")}. Compressed files should not be committed as may be pretty large and contain potential malign files.`,
                feel: InsightFeel.negative,
            };
        }
        return {
            text: ``,
            feel: InsightFeel.hidden,
        };
    }
}
