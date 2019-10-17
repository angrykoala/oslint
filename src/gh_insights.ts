import { GitHubRepository, ContentItem } from "./providers/github_provider";
import { ProjectInsightsData } from "./project_insights";

interface GHInsightData {
    hasReadme: boolean;
    hasLicense: boolean;
    hasDescription: boolean;
    hasCodeOfConduct: boolean;
    hasContributing: boolean;
    // hasIssueTemplate: boolean;
    // hasPRTemplate: boolean;
}

export class GHInsights {

    public generate(projectInsight: ProjectInsightsData, projectMetrics: GitHubRepository, contents: Array<ContentItem>): GHInsightData {
        return {
            hasReadme: projectInsight.hasReadme,
            hasLicense: projectInsight.hasLicense,
            hasDescription: Boolean(projectMetrics.description),
            hasCodeOfConduct: Boolean(this.searchContentFor(contents, /^code_of_conduct(\.\S+)?/i)),
            hasContributing: Boolean(this.searchContentFor(contents, /^contributing(\.\S+)?/i)),

        };
    }

    private searchContentFor(contents: Array<ContentItem>, regex: RegExp): ContentItem | void {
        for (const content of contents) {
            if (content.type === 'file' && regex.test(content.name)) return content;
        }
    }
}
