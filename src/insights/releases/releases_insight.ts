import { PartialInsight, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";
import { Insight } from "../insight";

export abstract class ReleasesInsight extends Insight {
    protected section: InsightSection;

    public constructor() {
        super();
        this.section = InsightSection.releases;
    }

    protected abstract execute(metrics: ProviderMetrics): PartialInsight;
}
