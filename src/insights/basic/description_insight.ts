import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";

export default class DescriptionInsight extends Insight {
    protected id = "hasLicense";
    protected section = "Basic";
    protected type = InsightType.text;

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const title = "Homepage";
        const description = metrics.project.description;

        if (description) {
            return {
                text: "",
                feel: InsightFeel.hidden,
                title
            };
        }
        return {
            text: "A project description is important to let people know what the project is about on lists and external links.",
            feel: InsightFeel.warning,
            title
        };
    }
}
