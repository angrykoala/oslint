import { ProviderMetrics } from "../provider";
import { InsightType, SerializedInsight, PartialInsight, InsightSection } from "./types";

export abstract class Insight {
    protected abstract id: string;
    protected abstract section: InsightSection;
    protected abstract type: InsightType;
    protected abstract title: string;

    public generateInsight(metrics: ProviderMetrics): SerializedInsight {
        return {
            id: this.id,
            type: this.type,
            section: this.section,
            title: this.title,
            ...this.execute(metrics)
        };
    }

    protected abstract execute(metrics: ProviderMetrics): PartialInsight;
}
