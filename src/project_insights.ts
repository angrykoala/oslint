import { GitHubRepository, ContentItem, RepositoryIssue } from "./providers/github_provider";

export interface ProjectInsightsData {
    hasReadme: boolean;
    hasLicense: boolean;
    hasOpenedIssues: boolean;
    oldIssuesCount: number;
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
            oldIssuesCount: this.getExpiredIssues(issues)
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
