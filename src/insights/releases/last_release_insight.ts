import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { ReleasesInsight } from "./releases_insight";
import { getDaysSinceDate } from "../../utils";

const oldReleaseDays = 60;

export default class LastReleaseInsight extends ReleasesInsight {
    protected id = "lastRelease";
    protected type = InsightType.text;
    protected title = "Last Release";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const lastRelease = metrics.releases[0]
        if (lastRelease) {
            const daysSinceRelease = getDaysSinceDate(lastRelease.publishedAt);
            if (daysSinceRelease > oldReleaseDays) {
                return {
                    text: `Your last release "${lastRelease.name}" is from ${daysSinceRelease} days ago. Consider increasing your release frequency.`,
                    feel: InsightFeel.warning,
                };
            } else {
                return {
                    text: `Your last release "${lastRelease.name}" is from ${daysSinceRelease} days ago.`,
                    feel: InsightFeel.positive,
                };
            }
        }
        return {
            text: "",
            feel: InsightFeel.hidden
        }
    }
}
