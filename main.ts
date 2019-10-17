import { GitHubProvider } from "./src/providers/github_provider";
import { ProjectInsights } from "./src/project_insights";
import { GHInsights } from "./src/gh_insights";

async function main(): Promise<void> {
    const ghProvider = new GitHubProvider("angrykoala", "wendigo");
    const projectInsights = new ProjectInsights({
        issueExpirationDays: 30
    });
    const ghInsights = new GHInsights();

    const metrics = {
        project: await ghProvider.fetchRepoMetrics(),
        contributors: await ghProvider.fetchContributors(),
        issues: await ghProvider.fetchIssues(),
        contents: await ghProvider.fetchContents(),
    };
    const insights = projectInsights.generate(metrics.project, metrics.contents, metrics.issues);
    const ghInsightsData = ghInsights.generate(insights, metrics.project, metrics.contents);

    console.log(metrics);
    console.log(insights);
    console.log(ghInsightsData);
}

main().then(() => {
    console.log("Finished");
});
