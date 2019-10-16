import { GitHubProvider } from "./src/providers/github_provider";

async function main(): Promise<void> {
    const ghProvider = new GitHubProvider("angrykoala", "wendigo");
    // const result = await ghProvider.fetchRepoMetrics();
    const contents = await ghProvider.fetchContents();

    // console.log(result);
    console.log(contents);
}

main().then(() => {
    console.log("Finished");
});
