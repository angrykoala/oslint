import { InsightType, PartialInsight, InsightFeel } from "../../types";
import { ProviderMetrics } from "../../../provider";
import { findFilesByNames } from "../../../strategies/files";
import { RepositoryInsight } from "../repository_insight";

export default class CrendetialFilesInsight extends RepositoryInsight {
    protected id = "credentialFiles";
    protected type = InsightType.text;
    protected title = "Crendetial Files";

    private credentialFiles = ["id_rsa", ".ssh", "rabbitmq.conf", "key.json", ".env.production"];

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const unwantedFiles = findFilesByNames(metrics.contents, this.credentialFiles);
        if (unwantedFiles.length > 0) {
            return {
                text: `Found potentially dangerous files: ${unwantedFiles.join(",")}. These files may contain credentials, passwords or keys.`,
                feel: InsightFeel.negative
            };
        }
        return {
            text: ``,
            feel: InsightFeel.hidden
        };
    }
}
