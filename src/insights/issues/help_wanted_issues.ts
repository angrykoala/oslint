import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";
import { getIssuesByLabels } from "../../strategies/issues";

export default class HelpWantedIssuesInsight extends Insight {
    protected id = "helpWantedIssues";
    protected section = InsightSection.issues;
    protected type = InsightType.text;
    protected title = "Issues With Help Wanted Labels";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const helpWantedIssuesCount = getIssuesByLabels(metrics.issues, ["help wanted", "good first issue"]);
        return {
            text: `You have ${helpWantedIssuesCount ? helpWantedIssuesCount : "no"} issues with some label indicating you are looking for help. These labels help contributors focus on tasks that are simple enough and useful.`,
            feel: helpWantedIssuesCount > 0 ? InsightFeel.positive : InsightFeel.negative
        };
    }
}
