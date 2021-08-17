import { InsightType, PartialInsight, InsightFeel } from "../types";
import { Release } from "../../github_provider";

import { ProviderMetrics } from "../../provider";
import { ReleasesInsight } from "./releases_insight";

export default class AssetsDownloads extends ReleasesInsight {
    protected id = "assetsDownloads";
    protected type = InsightType.text;
    protected title = "Assets Downloads";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        if (metrics.releases.length > 0) {
            let downloads = 0;
            for (const release of metrics.releases) {
                downloads += this.getReleaseDownloads(release);
            }

            const feel = downloads > 0 ? InsightFeel.positive : InsightFeel.neutral;
            return {
                text: `Your project assets have ${downloads} downloads.`,
                feel: feel
            };
        }
        return {
            text: "",
            feel: InsightFeel.hidden
        }
    }

    private getReleaseDownloads(release: Release): number {
        let downloads = 0;
        for (const asset of release.assets) {
            downloads += asset.downloads;
        }
        return downloads;
    }
}
