import { Insight } from "../insight";
import { InsightType, PartialInsight, InsightFeel, InsightSection } from "../types";
import { ProviderMetrics } from "../../provider";
import { Branch } from "../../github_provider";
import { getDaysSinceDate, formatDate } from "../../utils";

const branchExpirationDays = 30;

export default class OldBranchesInsight extends Insight {
    protected id = "oldBranches";
    protected section = InsightSection.branches;
    protected type = InsightType.text;
    protected title = "Old Branches";

    private ignoredBranches = ["master", "main", "dev", "develop", "gh-pages"];

    protected execute(metrics: ProviderMetrics): PartialInsight {
        const oldBranches = this.getExpiredBranches(metrics.branches);

        const filteredOldBranches = oldBranches.filter(b => !this.shouldIgnoreBranch(b, metrics.project.defaultBranch));


        if (filteredOldBranches.length >= 1) {
            const feel = filteredOldBranches.length >= 3 ? InsightFeel.negative : InsightFeel.warning;
            return {
                text: `You have ${filteredOldBranches.length} outdated Branches. Consider merging or deleting older branches.`,
                feel,
                links: filteredOldBranches.map(b => {
                    return {
                        url: b.url,
                        text: `${b.name} - ${formatDate(b.lastCommit.createdAt)}`
                    };
                })
            };
        }
        return {
            text: `You have no outdated branches.`,
            feel: InsightFeel.positive
        };
    }

    private getExpiredBranches(branches: Array<Branch>): Array<Branch> {
        return branches.filter((b) => {
            const daysSinceIssue = getDaysSinceDate(b.lastCommit.createdAt);
            return daysSinceIssue > branchExpirationDays;
        });
    }

    private shouldIgnoreBranch(branch: Branch, defaultBranch: Branch): boolean {
        const toIgnore = [...this.ignoredBranches, defaultBranch.name];
        if (toIgnore.includes(branch.name)) return true;
        else return false;
    }
}
