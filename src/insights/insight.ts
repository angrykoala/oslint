import { ProviderMetrics } from "../provider";
import { InsightType, SerializedInsight, PartialInsight } from "./types";

export abstract class Insight {
    protected abstract id: string;
    protected abstract section: string;
    protected abstract type: InsightType;

    public generateInsight(metrics: ProviderMetrics): SerializedInsight {
        return {
            id: this.id,
            type: this.type,
            section: this.section,
            ...this.execute(metrics)
        };
    }

    protected abstract execute(metrics: ProviderMetrics): PartialInsight;
}
