import { GitHubRepository, ContentItem, RepositoryIssue } from "./github_provider";

export interface ProjectInsightsData {
    hasReadme: SerializedInsight;
    hasLicense: SerializedInsight;
    hasOpenIssues: SerializedInsight;
    oldIssues: SerializedInsight;
    issuesWithoutDescription: SerializedInsight;
    hasDescription: SerializedInsight;
    hasCodeOfConduct: SerializedInsight;
    hasContributing: SerializedInsight;
    hasIDEFiles: SerializedInsight;
    hasCompiledFiles: SerializedInsight;
    hasEnvFiles: SerializedInsight;
    hasDependencyFiles: SerializedInsight;
    helpWantedIssues: SerializedInsight;
    // hasIssueTemplate: SerializedInsight;
    // hasPRTemplate: SerializedInsight;
}

export interface SerializedInsight {
    title: string;
    text: string;
    type: InsightType;
}

export type InsightType = "positive" | "negative" | "neutral" | "hidden";

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
            ...this.generateProjectInsight(projectMetrics),
            ...this.generateRequiredFilesInsights(contents),
            ...this.generateIssueInsights(projectMetrics, issues),
            ...this.generateUnwantedFilesInsights(contents)
        };
    }

    private generateProjectInsight(projectMetrics: GitHubRepository): Pick<ProjectInsightsData, "hasDescription" | "hasLicense"> {
        const hasDescription = Boolean(projectMetrics.description);
        // hasLicense: this.generateRequiredFileInsight(contents, /^license(\.\S+)?/i, "License"),
        const license = projectMetrics.license;
        let licenseText = "Your project doesn't appear to have a License, it is important to make your Open Source available to anyone who visit your project.";
        if (license) {
            licenseText = `Your project is licensed under ${license.name} ${license.url ? "<" + license.url + ">" : ""}`;
        }
        return {
            hasDescription: {
                title: "Project Has Description?",
                text: hasDescription ? "" : "A project description is important to let people know what the project is about on lists and external links.",
                type: hasDescription ? "hidden" : "negative"
            },
            hasLicense: {
                title: "Has License?",
                text: licenseText,
                type: Boolean(license) ? "positive" : "negative"
            }
        };
    }

    private generateRequiredFilesInsights(contents: Array<ContentItem>): Pick<ProjectInsightsData, "hasReadme" | "hasCodeOfConduct" | "hasContributing"> {
        return {
            hasReadme: this.generateRequiredFileInsight(contents, /^readme(\.\S+)?/i, "Readme"),
            hasCodeOfConduct: this.generateRequiredFileInsight(contents, /^code_of_conduct(\.\S+)?/i, "Code Of Conduct"),
            hasContributing: this.generateRequiredFileInsight(contents, /^contributing(\.\S+)?/i, "Contributing")
        };
    }

    private generateUnwantedFilesInsights(contents: Array<ContentItem>): Pick<ProjectInsightsData, "hasIDEFiles" | "hasCompiledFiles" | "hasEnvFiles" | "hasDependencyFiles"> {
        const contentsFilenames = contents.map(c => c.name);

        return {
            hasIDEFiles: this.generateUnwantedFileInsight(contentsFilenames, [".vscode", ".idea", ".vs", ".pk", ".pem", ".pub"], "IDE Files"),
            hasCompiledFiles: this.generateUnwantedFileInsight(contentsFilenames, [".cache", "dist"], "Compiled Files"),
            hasEnvFiles: this.generateUnwantedFileInsight(contentsFilenames, [".env"], "Environment Files"),
            hasDependencyFiles: this.generateUnwantedFileInsight(contentsFilenames, ["node_modules"], "Dependencies"),
        };
    }

    private generateIssueInsights(projectMetrics: GitHubRepository, issues: Array<RepositoryIssue>): Pick<ProjectInsightsData, "hasOpenIssues" | "oldIssues" | "issuesWithoutDescription" | "helpWantedIssues"> {
        const hasOpenIssues: SerializedInsight = {
            title: "Has Open Issues?",
            text: "You don't seem to have opened issues, this means potential colaborators don't know how to help",
            type: "negative"
        };
        if (projectMetrics.openIssues > 0) {
            hasOpenIssues.text = `You have ${projectMetrics.openIssues} open isues`;
            hasOpenIssues.type = "neutral";
        }
        const oldIssuesCount = this.getExpiredIssues(issues);
        const oldIssuesCountInsight: SerializedInsight = {
            title: "Old Issues",
            text: `You have ${oldIssuesCount ? oldIssuesCount : "no"} outdated issues.`,
            type: "positive"
        };

        if (oldIssuesCount > (projectMetrics.openIssues / 4)) {
            oldIssuesCountInsight.text += ` You should consider closing issues no longer relevant or update them to ensure your contributors work on important things.`;
            oldIssuesCountInsight.type = "negative";
        }

        const issuesWithDescriptionCount = issues.filter(i => Boolean(i.description)).length;
        const issuesWithoutDescriptionInsight: SerializedInsight = {
            title: "Issues Without Description",
            text: `You have ${issuesWithDescriptionCount ? issuesWithDescriptionCount : "no"} issues without description.`,
            type: "neutral"
        };
        if (issuesWithDescriptionCount >= 1) {
            issuesWithoutDescriptionInsight.text += " Remember that having issues without a proper description may not provide enough context for a contributor to work on these issues";
            issuesWithoutDescriptionInsight.type = "negative";
        }

        const helpWantedIssuesCount = this.getIssuesByLabels(issues, ["help wanted", "good first issue"]);
        const issuesWithHelpWantedInsight: SerializedInsight = {
            title: "Issues With Help Wanted Labels",
            text: `You have ${helpWantedIssuesCount ? helpWantedIssuesCount : "no"} issues with some label indicating you are looking for help. These labels help contributors focus on tasks that are simple enough and useful.`,
            type: helpWantedIssuesCount > 0 ? "positive" : "negative"
        };

        return {
            hasOpenIssues,
            oldIssues: oldIssuesCountInsight,
            issuesWithoutDescription: issuesWithoutDescriptionInsight,
            helpWantedIssues: issuesWithHelpWantedInsight
        };
    }

    private generateRequiredFileInsight(contents: Array<ContentItem>, regexp: RegExp, filename: string): SerializedInsight {
        const hasFile = Boolean(this.searchContentFor(contents, regexp));
        let text = `File "${filename}" not found within your project.`;
        if (hasFile) {
            text = `Great! File "${filename}" found within your project.`;

        }
        return {
            title: `Has ${filename}?`,
            text: text,
            type: hasFile ? "positive" : "negative",
        };
    }

    private generateUnwantedFileInsight(contentsFilenames: Array<string>, files: Array<string>, title: string): SerializedInsight {
        const intersection = files.filter(x => contentsFilenames.includes(x));

        return {
            title: title,
            type: intersection.length > 0 ? "negative" : "hidden",
            text: intersection.length > 0 ? `Found some files not usually committed to the repository: ${intersection.join(",")}` : ""
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

    private getIssuesByLabels(issues: Array<RepositoryIssue>, labels: Array<string>): number {
        return issues.filter((issue) => {
            const labelsIntersection = issue.labels.filter(x => labels.includes(x));
            return labelsIntersection.length > 0;
        }).length;
    }
}
