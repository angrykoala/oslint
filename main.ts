import { ProjectInsights } from "./src/project_insights";
import { GitHubProvider } from "./src/github_provider";

async function main(): Promise<void> {
    const ghProvider = new GitHubProvider("angrykoala", "wendigo");
    const projectInsights = new ProjectInsights({
        issueExpirationDays: 30
    });

    const metrics = {
        project: await ghProvider.fetchRepoMetrics(),
        contributors: await ghProvider.fetchContributors(),
        issues: await ghProvider.fetchIssues(),
        contents: await ghProvider.fetchContents(),
    };
    const insights = projectInsights.generate(metrics.project, metrics.contents, metrics.issues);

    console.log(metrics);
    console.log(insights);
}

main().then(() => {
    console.log("Finished");
});
