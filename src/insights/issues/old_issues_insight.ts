import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel } from "../types";
import { ProviderMetrics } from "../../provider";
import { RepositoryIssue } from "../../github_provider";
import { getDaysSinceDate } from "../../utils";

const issueExpirationDays = 30;

export default class OldIssuesInsight extends Insight {
    protected id = "oldIssues";
    protected section = "Issues";
    protected type = InsightType.text;
    protected title = "Old Issues";

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const oldIssues = this.getExpiredIssues(metrics.issues);

        if (oldIssues.length >= 1) {
            const feel = oldIssues.length >= 6 ? InsightFeel.negative : InsightFeel.warning;
            return {
                text: `You have ${oldIssues.length} outdated Issues. Consider removing old, duplicate or less important issues. Having old issues make it harder for contributores to focus on important tasks.`,
                feel,
                links: oldIssues.map(i => {
                    return {
                        url: i.url,
                        text: `#${i.number} - ${i.title}`
                    };
                })
            };
        }
        return {
            text: `You have no outdated issues.`,
            feel: InsightFeel.positive
        };
    }

    private getExpiredIssues(issues: Array<RepositoryIssue>): Array<RepositoryIssue> {
        return issues.filter((i) => {
            const daysSinceIssue = getDaysSinceDate(i.updatedAt);
            return daysSinceIssue > issueExpirationDays;
        });
    }
}
