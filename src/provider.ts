import { ProjectInsights } from "./project_insights";
import { GitHubProvider } from "./github_provider";

const githubCredentials = {
    username: process.env.GITHUB_USERNAME as string,
    token: process.env.GITHUB_TOKEN as string
};
if (!githubCredentials.username || !githubCredentials.token) throw new Error("Missing Github Credentials");
export default async function generateMetrics(username: string, repo: string): Promise<any> {
    const ghProvider = new GitHubProvider(githubCredentials, username, repo);
    const projectInsights = new ProjectInsights({
        issueExpirationDays: 180
    });

    const data = await Promise.all([
        ghProvider.fetchRepoMetrics(),
        ghProvider.fetchContributors(),
        ghProvider.fetchIssues(),
        ghProvider.fetchContents()
    ]);

    const metrics = {
        project: data[0],
        contributors: data[1],
        issues: data[2],
        contents: data[3],
    };
    const insights = projectInsights.generate(metrics.project, metrics.contents, metrics.issues);
    return {
        metrics,
        insights
    };
}
