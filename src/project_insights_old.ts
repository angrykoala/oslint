// import { ContentItem, RepositoryIssue, PullRequest, ProjectMetrics } from "./github_provider";
// import { ProviderMetrics } from "./provider";
//
// export interface ProjectInsightsData {
//     hasReadme: SerializedInsight;
//     hasLicense: SerializedInsight;
//     hasOpenIssues: SerializedInsight;
//     oldIssues: SerializedInsight;
//     issuesWithoutDescription: SerializedInsight;
//     hasDescription: SerializedInsight;
//     hasCodeOfConduct: SerializedInsight;
//     hasContributing: SerializedInsight;
//     hasIDEFiles: SerializedInsight;
//     hasCompiledFiles: SerializedInsight;
//     hasEnvFiles: SerializedInsight;
//     hasDependencyFiles: SerializedInsight;
//     helpWantedIssues: SerializedInsight;
//     hasIssueTemplate: SerializedInsight;
//     hasPRTemplate: SerializedInsight;
//     oldPullRequests: SerializedInsight;
//     hasOpenPullRequests: SerializedInsight;
//     hasHomepage: SerializedInsight;
// }
//
//
//
//
// interface ProjectInsightsConfig {
//     issueExpirationDays: number;
//     pullRequestExpirationDays: number;
// }
//
// export class ProjectInsights {
//     private config: ProjectInsightsConfig;
//
//     constructor(config: ProjectInsightsConfig) {
//         this.config = config;
//     }
//
//     public generate(metrics: ProviderMetrics): ProjectInsightsData {
//         return {
//             ...this.generateProjectInsight(metrics.project),
//             ...this.generateRequiredFilesInsights(metrics.contents),
//             ...this.generateIssueInsights(metrics.issues),
//             ...this.generateUnwantedFilesInsights(metrics.contents),
//             ...this.generateGHCommunityInsights(metrics.project),
//             ...this.generatePullRequestInsights(metrics.pullRequests)
//         };
//     }
//
//     private generateProjectInsight(projectMetrics: ProjectMetrics): Pick<ProjectInsightsData, "hasDescription" | "hasLicense" | "hasHomepage"> {
//         const hasDescription = Boolean(projectMetrics.description);
//         const hasHomepage = Boolean(projectMetrics.homepage);
//         const license = projectMetrics.license;
//         let licenseText = "Your project doesn't appear to have a License, it is important to make your Open Source available to anyone who visit your project.";
//         if (license) {
//             licenseText = `Your project is licensed under ${license.name} ${license.url ? "<" + license.url + ">" : ""}`;
//         }
//
//         const homepageText = hasHomepage ? `Project Webpage found at <${projectMetrics.homepage}>` : "Your project doesn't seem to have a homepage, a public webpage will help people find your project online.";
//
//         return {
//             hasDescription: {
//                 title: "Project Has Description?",
//                 text: hasDescription ? "" : "A project description is important to let people know what the project is about on lists and external links.",
//                 type: hasDescription ? "hidden" : "negative"
//             },
//             hasLicense: {
//                 title: "Has License?",
//                 text: licenseText,
//                 type: Boolean(license) ? "positive" : "negative"
//             },
//             hasHomepage: {
//                 title: "Has Homepage",
//                 text: homepageText,
//                 type: hasHomepage ? "neutral" : "warning"
//             }
//         };
//     }
//
//     private generateRequiredFilesInsights(contents: Array<ContentItem>): Pick<ProjectInsightsData, "hasReadme" | "hasCodeOfConduct" | "hasContributing"> {
//         return {
//             hasReadme: this.generateRequiredFileInsight(contents, /^readme(\.\S+)?/i, "Readme"),
//             hasCodeOfConduct: this.generateRequiredFileInsight(contents, /^code_of_conduct(\.\S+)?/i, "Code Of Conduct"),
//             hasContributing: this.generateRequiredFileInsight(contents, /^contributing(\.\S+)?/i, "Contributing")
//         };
//     }
//
//     private generateUnwantedFilesInsights(contents: Array<ContentItem>): Pick<ProjectInsightsData, "hasIDEFiles" | "hasCompiledFiles" | "hasEnvFiles" | "hasDependencyFiles"> {
//         const contentsFilenames = contents.map(c => c.name);
//
//         return {
//             hasIDEFiles: this.generateUnwantedFileInsight(contentsFilenames, [".vscode", ".idea", ".vs", ".pk", ".pem", ".pub"], "IDE Files"),
//             hasCompiledFiles: this.generateUnwantedFileInsight(contentsFilenames, [".cache", "dist"], "Compiled Files"),
//             hasEnvFiles: this.generateUnwantedFileInsight(contentsFilenames, [".env"], "Environment Files"),
//             hasDependencyFiles: this.generateUnwantedFileInsight(contentsFilenames, ["node_modules"], "Dependencies"),
//         };
//     }
//
//     private generateIssueInsights(openIssues: Array<RepositoryIssue>): Pick<ProjectInsightsData, "hasOpenIssues" | "oldIssues" | "issuesWithoutDescription" | "helpWantedIssues"> {
//         const openIssuesCount = openIssues.length;
//         const hasOpenIssues: SerializedInsight = {
//             title: "Has Open Issues?",
//             text: "You don't seem to have opened issues, this means potential colaborators don't know how to help",
//             type: "negative"
//         };
//         if (openIssuesCount > 0) {
//             hasOpenIssues.text = `You have ${openIssuesCount} open isues.`;
//             hasOpenIssues.type = "neutral";
//             if (openIssuesCount > 100) {
//                 hasOpenIssues.text += ` You should consider removing old, duplicate or less important issues. Having too many issues make it harder for contributores to focus on important tasks.`;
//                 hasOpenIssues.type = "negative";
//             }
//         }
//         const oldIssuesCount = this.getExpiredIssues(openIssues);
//         const oldIssuesCountInsight: SerializedInsight = {
//             title: "Old Issues",
//             text: `You have ${oldIssuesCount ? oldIssuesCount : "no"} outdated issues.`,
//             type: "positive"
//         };
//
//         if (oldIssuesCount > (openIssuesCount / 4)) {
//             oldIssuesCountInsight.text += ` You should consider closing issues no longer relevant or update them to ensure your contributors work on important things.`;
//             oldIssuesCountInsight.type = "negative";
//         }
//
//         const issuesWithoutDescriptionCount = openIssues.filter(i => !i.description).length;
//         const issuesWithoutDescriptionInsight: SerializedInsight = {
//             title: "Issues Without Description",
//             text: `You have ${issuesWithoutDescriptionCount ? issuesWithoutDescriptionCount : "no"} issues without description.`,
//             type: "neutral"
//         };
//         if (issuesWithoutDescriptionCount >= 1) {
//             issuesWithoutDescriptionInsight.text += " Remember that having issues without a proper description may not provide enough context for a contributor to work on these issues";
//             issuesWithoutDescriptionInsight.type = "negative";
//         }
//
//         const helpWantedIssuesCount = this.getIssuesByLabels(openIssues, ["help wanted", "good first issue"]);
//         const issuesWithHelpWantedInsight: SerializedInsight = {
//             title: "Issues With Help Wanted Labels",
//             text: `You have ${helpWantedIssuesCount ? helpWantedIssuesCount : "no"} issues with some label indicating you are looking for help. These labels help contributors focus on tasks that are simple enough and useful.`,
//             type: helpWantedIssuesCount > 0 ? "positive" : "negative"
//         };
//
//         return {
//             hasOpenIssues,
//             oldIssues: oldIssuesCountInsight,
//             issuesWithoutDescription: issuesWithoutDescriptionInsight,
//             helpWantedIssues: issuesWithHelpWantedInsight,
//         };
//     }
//
//     private generateGHCommunityInsights(projectMetrics: ProjectMetrics): Pick<ProjectInsightsData, "hasIssueTemplate" | "hasPRTemplate"> {
//         const hasPRTemplate: SerializedInsight = {
//             title: "Has Pull Request Template?",
//             text: "You don't have a Pull Request Template, A template might help collaborators on following the project processes and making worthwhile PRs.",
//             type: "negative"
//         };
//
//         if (projectMetrics.community.pullRequestTemplate) {
//             hasPRTemplate.text = "You have a Pull Request Template, helping newcomers to contribute.";
//             hasPRTemplate.type = "positive";
//         }
//         const hasIssueTemplate: SerializedInsight = {
//             title: "Has Issue Template?",
//             text: "You don't have an Issue Template, A template might help collaborators on following the project processes and making worthwhile Issues.",
//             type: "negative"
//         };
//
//         if (projectMetrics.community.issueTemplate) {
//             hasIssueTemplate.text = "You have an Issue Template, helping newcomers to contribute and contact maintainers.";
//             hasIssueTemplate.type = "positive";
//         }
//
//         return {
//             hasPRTemplate,
//             hasIssueTemplate
//         };
//     }
//
//     private generatePullRequestInsights(pullRequests: Array<PullRequest>): Pick<ProjectInsightsData, "oldPullRequests" | "hasOpenPullRequests"> {
//         const pullRequestsCount = pullRequests.length;
//         const hasOpenPullRequests: SerializedInsight = {
//             title: "Has Open Pull Requests?",
//             text: "You don't have open PRs.",
//             type: "neutral"
//         };
//         if (pullRequestsCount > 0) {
//             hasOpenPullRequests.text = `You have ${pullRequestsCount} open Pull Requests.`;
//             hasOpenPullRequests.type = "warning";
//             if (pullRequestsCount > 30) {
//                 hasOpenPullRequests.text += ` Consider removing old, invalid or uncompleted PRs. Having too many PRs will make it harder for owners to quickly review new PRs.`;
//                 hasOpenPullRequests.type = "negative";
//             }
//         }
//         const oldPullRequestsCount = this.getExpiredPullRequests(pullRequests);
//         const oldPullRequests: SerializedInsight = {
//             title: "Old PRs",
//             text: `You have ${oldPullRequestsCount ? oldPullRequestsCount : "no"} outdated Pull Requests.`,
//             type: "positive"
//         };
//
//         if (oldPullRequestsCount >= 1) {
//             oldPullRequests.text += ` You should review or close old Pull Requests as soon as possible to ensure a good experience for contributors.`;
//             oldPullRequests.type = "negative";
//         }
//
//         return {
//             oldPullRequests,
//             hasOpenPullRequests
//         };
//     }
//
//     private generateRequiredFileInsight(contents: Array<ContentItem>, regexp: RegExp, filename: string): SerializedInsight {
//         const hasFile = Boolean(this.searchContentFor(contents, regexp));
//         let text = `File "${filename}" not found within your project.`;
//         if (hasFile) {
//             text = `Great! File "${filename}" found within your project.`;
//
//         }
//         return {
//             title: `Has ${filename}?`,
//             text: text,
//             type: hasFile ? "positive" : "negative",
//         };
//     }
//
//     private generateUnwantedFileInsight(contentsFilenames: Array<string>, files: Array<string>, title: string): SerializedInsight {
//         const intersection = files.filter(x => contentsFilenames.includes(x));
//
//         return {
//             title: title,
//             type: intersection.length > 0 ? "negative" : "hidden",
//             text: intersection.length > 0 ? `Found some files not usually committed to the repository: ${intersection.join(",")}` : ""
//         };
//     }
//
//     private searchContentFor(contents: Array<ContentItem>, regex: RegExp): ContentItem | void {
//         for (const content of contents) {
//             if (content.type === 'file' && regex.test(content.name)) return content;
//         }
//     }
//
//     private getExpiredIssues(issues: Array<RepositoryIssue>): number {
//         const daysToTimestamp = 86400000;
//         const filterTimestamp = new Date().getTime() - (this.config.issueExpirationDays * daysToTimestamp);
//         return issues.filter((i) => {
//             return i.updatedAt.getTime() < filterTimestamp;
//         }).length;
//     }
//
//     private getExpiredPullRequests(pullRequests: Array<PullRequest>): number {
//         const daysToTimestamp = 86400000;
//         const filterTimestamp = new Date().getTime() - (this.config.pullRequestExpirationDays * daysToTimestamp);
//         return pullRequests.filter((pr) => {
//             return pr.updatedAt.getTime() < filterTimestamp;
//         }).length;
//     }
//
//     private getIssuesByLabels(issues: Array<RepositoryIssue>, labels: Array<string>): number {
//         return issues.filter((issue) => {
//             const labelsIntersection = issue.labels.filter(x => labels.includes(x));
//             return labelsIntersection.length > 0;
//         }).length;
//     }
// }
