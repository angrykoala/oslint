import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";

export default class HomepageInsight extends Insight {
    protected id = "hasLicense";
    protected section = "Basic";
    protected type = InsightType.text;

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const title = "Homepage";
        const homepage = metrics.project.homepage;

        if (homepage) {
            return {
                text: `Project Webpage found at <${homepage}>`,
                feel: InsightFeel.neutral,
                title
            };
        }
        return {
            text: `Your project doesn't seem to have a homepage, a public webpage will help people find your project online.`,
            feel: InsightFeel.warning,
            title
        };
    }
}
