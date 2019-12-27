import { PartialInsight, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";
import { Insight } from "../insight";

export abstract class RepositoryInsight extends Insight {
    protected section: InsightSection;

    public constructor() {
        super();
        this.section = InsightSection.repository;
    }

    protected abstract execute(metrics: ProviderMetrics): PartialInsight;
}
