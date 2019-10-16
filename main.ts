import { GitHubProvider } from "./src/providers/github_provider";

async function main(): Promise<void> {
    const ghProvider = new GitHubProvider();
    const result = await ghProvider.fetchRepoMetrics("angrykoala", "wendigo");

    console.log(result);
}

main().then(() => {
    console.log("Finished");
});
