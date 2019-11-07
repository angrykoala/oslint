import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";

export default class DescriptionInsight extends Insight {
    protected id = "hasDescription";
    protected section = "Basic";
    protected type = InsightType.text;
    protected title = "Description";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const description = metrics.project.description;

        if (description) {
            return {
                text: "",
                feel: InsightFeel.hidden,
            };
        }
        return {
            text: "A project description is important to let people know what the project is about on lists and external links.",
            feel: InsightFeel.warning,
        };
    }
}
