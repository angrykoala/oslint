import { ProjectInsights } from "./project_insights";
import { GitHubProvider, ProjectMetrics, RepositoryContributor, RepositoryIssue, PullRequest, ContentItem } from "./github_provider";

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

export default async function generateMetrics(username: string, repo: string): Promise<any> {
    const ghProvider = new GitHubProvider(githubCredentials, username, repo);
    const projectInsights = new ProjectInsights({
        issueExpirationDays: 180,
        pullRequestExpirationDays: 20
    });

    const data = await Promise.all([
        ghProvider.fetchRepoMetrics(),
        ghProvider.fetchContributors(),
        ghProvider.fetchIssues(),
        ghProvider.fetchContents(),
        ghProvider.fetchPullRequests()
    ]);

    const metrics = {
        project: data[0],
        contributors: data[1],
        issues: data[2],
        contents: data[3],
        pullRequests: data[4]
    };
    const insights = projectInsights.generate(metrics);
    return {
        metrics,
        insights
    };
}
