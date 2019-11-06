// import { ProjectInsights } from "./project_insights";
import { GitHubProvider, ProjectMetrics, RepositoryContributor, RepositoryIssue, PullRequest, ContentItem } from "./github_provider";
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
    contributors: Array<RepositoryContributor>;
    issues: Array<RepositoryIssue>;
    contents: Array<ContentItem>;
    pullRequests: Array<PullRequest>;
}

export async function generateMetrics(username: string, repo: string): Promise<any> {
    const ghProvider = new GitHubProvider(githubCredentials, username, repo);

    const data = await Promise.all([
        ghProvider.fetchRepoMetrics(),
        ghProvider.fetchContributors(),
        ghProvider.fetchIssues(),
        ghProvider.fetchContents(),
        ghProvider.fetchPullRequests()
    ]);

    const metrics: ProviderMetrics = {
        project: data[0],
        contributors: data[1],
        issues: data[2],
        contents: data[3],
        pullRequests: data[4]
    };
    return metrics;
}

export function generateInsights(metrics: ProviderMetrics): Array<SerializedInsight> {
    return InsightsList.map((insight: Insight) => {
        return insight.generateInsight(metrics);
    });
}
