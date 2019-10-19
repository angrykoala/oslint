import { GitHubRepository, ContentItem, RepositoryIssue } from "./github_provider";

export interface ProjectInsightsData {
    hasReadme: boolean;
    hasLicense: boolean;
    hasOpenedIssues: boolean;
    oldIssuesCount: number;
    issuesWithDescriptionCount: number;
    hasDescription: boolean;
    hasCodeOfConduct: boolean;
    hasContributing: boolean;
    // hasIssueTemplate: boolean;
    // hasPRTemplate: boolean;
}

interface ProjectInsightsConfig {
    issueExpirationDays: number;
}

export class ProjectInsights {
    private config: ProjectInsightsConfig;

    constructor(config: ProjectInsightsConfig) {
        this.config = config;
    }

    public generate(projectMetrics: GitHubRepository, contents: Array<ContentItem>, issues: Array<RepositoryIssue>): ProjectInsightsData {
        return {
            hasReadme: Boolean(this.searchContentFor(contents, /^readme(\.\S+)?/i)),
            hasLicense: Boolean(this.searchContentFor(contents, /^license(\.\S+)?/i)),
            hasOpenedIssues: projectMetrics.openIssues > 0,
            oldIssuesCount: this.getExpiredIssues(issues),
            issuesWithDescriptionCount: issues.filter(i => Boolean(i.description)).length,
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

    private getExpiredIssues(issues: Array<RepositoryIssue>): number {
        const daysToTimestamp = 86400000;
        const filterTimestamp = new Date().getTime() - (this.config.issueExpirationDays * daysToTimestamp);
        return issues.filter((i) => {
            return i.updatedAt.getTime() < filterTimestamp;
        }).length;
    }
}
