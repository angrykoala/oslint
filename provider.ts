import { ProjectInsights } from "./src/project_insights";
import { GitHubProvider } from "./src/github_provider";

export default async function generateMetrics(username: string, repo: string): Promise<any> {
    const ghProvider = new GitHubProvider(username, repo);
    const projectInsights = new ProjectInsights({
        issueExpirationDays: 180
    });

    const metrics = {
        project: await ghProvider.fetchRepoMetrics(),
        contributors: await ghProvider.fetchContributors(),
        issues: await ghProvider.fetchIssues(),
        contents: await ghProvider.fetchContents(),
    };
    const insights = projectInsights.generate(metrics.project, metrics.contents, metrics.issues);
    return {
        metrics,
        insights
    };
}
