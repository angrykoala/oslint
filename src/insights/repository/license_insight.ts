import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { RepositoryInsight } from "./repository_insight";

export default class LicenseInsight extends RepositoryInsight {
    protected id = "hasLicense";
    protected type = InsightType.text;
    protected title = "Has License?";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const license = metrics.project.license;

        // TODO: check "Other" license
        if (license) {
            return {
                text: `Your project is licensed under ${license.name}`,
                feel: InsightFeel.positive
            };
        }
        return {
            text: `Your project doesn't appear to have a License. A license is required to make your Open Source available to anyone who visit your project."`,
            feel: InsightFeel.negative
        };
    }
}
