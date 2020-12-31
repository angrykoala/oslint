// import { ProjectInsights } from "./project_insights";
import { GitHubProvider, ProjectMetrics, RepositoryContributor, RepositoryIssue, PullRequest, ContentItem, Branch } from "./github_provider";
import { Insight } from "./insights/insight";
import InsightsList from './insights_list';
import { SerializedInsight } from "./insights/types";

const githubCredentials = {
    username: process.env.GITHUB_USERNAME as string,
    token: process.env.GITHUB_TOKEN as string
};
if (!githubCredentials.username || !githubCredentials.token) throw new Error("Missing Github Credentials");

export interface ProviderMetrics {
    project: ProjectMetrics;
    contributors?: Array<RepositoryContributor>;
    issues: Array<RepositoryIssue>;
    contents: Array<ContentItem>;
    pullRequests: Array<PullRequest>;
    branches: Array<Branch>;
}

export async function generateMetrics(username: string, repo: string): Promise<ProviderMetrics> {
    const ghProvider = new GitHubProvider(githubCredentials, username, repo);

    const data = await Promise.all([
        ghProvider.fetchRepoMetrics(),
        ghProvider.fetchContributors(),
        ghProvider.fetchIssues(),
        ghProvider.fetchContents(),
        ghProvider.fetchPullRequests(),
        ghProvider.fetchBranches()
    ]);


    const metrics: ProviderMetrics = {
        project: data[0] as ProjectMetrics,
        contributors: data[1],
        issues: data[2] as Array<RepositoryIssue>,
        contents: data[3] as Array<ContentItem>,
        pullRequests: data[4] as Array<PullRequest>,
        branches: data[5] as Array<Branch>
    };
    return metrics;
}

export function generateInsights(metrics: ProviderMetrics): Array<SerializedInsight> {
    return InsightsList.map((insight: Insight) => {
        return insight.generateInsight(metrics);
    });
}
