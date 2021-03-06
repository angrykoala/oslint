import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { RepositoryInsight } from "./repository_insight";

export default class HomepageInsight extends RepositoryInsight {
    protected id = "hasHomepage";
    protected type = InsightType.text;
    protected title = "Homepage";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const homepage = metrics.project.homepage;

        if (homepage) {
            return {
                text: `Project Webpage found!`,
                feel: InsightFeel.neutral,
                links: [{ url: homepage }]
            };
        }
        return {
            text: `Your project doesn't seem to have a homepage, a public webpage will help people find your project online.`,
            feel: InsightFeel.warning,
        };
    }
}
