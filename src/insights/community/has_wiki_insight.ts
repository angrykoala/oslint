import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";

export default class HasWikiInsight extends Insight {
    protected id = "hasWiki";
    protected section = InsightSection.community;
    protected type = InsightType.text;
    protected title = "Has Wiki?";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        if (metrics.project.hasWiki) {
            return {
                text: `Great! Your project has an open wiki.`,
                feel: InsightFeel.positive,
            };
        } else {
            return {
                text: `Your project doesn't seem to have an open wiki. Consider adding a wiki with information, examples and documentation about your project.`,
                feel: InsightFeel.neutral,
            };
        }
    }
}
