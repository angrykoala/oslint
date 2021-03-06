import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";
import { searchFile } from "../../strategies/files";

export default class CodeOfConductInsight extends Insight {
    protected id = "codeOfConduct";
    protected section = InsightSection.community;
    protected type = InsightType.text;
    protected title = "Has Code Of Conduct?";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const file = searchFile(metrics.contents, /^code_of_conduct(\.\S+)?/i);
        if (file) {
            return {
                text: `Great! File "${file.name}" found within your project.`,
                feel: InsightFeel.positive,
            };
        }
        return {
            text: `Code Of Conduct file not found within your project.`,
            feel: InsightFeel.negative,
        };
    }
}
