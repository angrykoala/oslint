import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { getDaysSinceDate } from "../../utils";

const commitInactivityDays = 20;

export default class CommitActivity extends Insight {
    protected id = "commitActivity";
    protected section = "Commits";
    protected type = InsightType.text;
    protected title = "Commit Activity";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const lastCommit = metrics.project.defaultBranch.lastCommit;
        const daysSinceLastCommit = getDaysSinceDate(lastCommit.createdAt);
        if (daysSinceLastCommit > commitInactivityDays) {
            return {
                text: `It's been a while since you last updated your project. Inactivity may reduce the engagement with new users or contributors, remember to periodically update your main branch "${metrics.project.defaultBranch.name}"`,
                feel: InsightFeel.warning,
            };
        }
        return {
            text: "",
            feel: InsightFeel.hidden,
        };
    }
}
