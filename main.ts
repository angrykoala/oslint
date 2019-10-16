import { GitHubProvider } from "./src/providers/github_provider";

async function main(): Promise<void> {
    const ghProvider = new GitHubProvider("angrykoala", "wendigo");
    // const result = await ghProvider.fetchRepoMetrics();
    const issues = await ghProvider.fetchIssues();

    // console.log(result);
    console.log(issues);
}

main().then(() => {
    console.log("Finished");
});
