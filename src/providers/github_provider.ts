import axios from 'axios';

interface GitHubRepository {
    id: number;
    name: string;
    isPrivate: boolean;
    owner: {
        username: string;
        id: number;
    };
    isFork: boolean;
    url: string;  // html_url
    createdAt: Date;
    updatedAt: Date;
    homepage?: string;
    stars: number; // stargazers_count
    language: string;
    forks: number;
    openIssues: number;
    license: {
        key: string;
        name: string;
        url: string;
    };
}
//
// type RepositoryContributors = Array<{
//     username: string;
//     id: string;
//     contributions: number;
// }>
//
//
// interface RepositoryIssue {
//     number: number;
//     state: "open" | "closed";
//     title: string;
//     comments: number;
//     creator: number; // user id
//     createdAt: Date;
//     updatedAt: Date;
//     closedAt: Date;
//     labels: Array<string>
// }
//
// interface RepositoryPR extends RepositoryIssue {
//     mergedAt: Date;
// }
//

export class GitHubProvider {
    public async fetchRepoMetrics(username: string | number, repository?: string): Promise<GitHubRepository> {
        let data;
        if (typeof username === 'number' && !repository) {
            data = await this.fetchRepoDataById(username);
        } else {
            const result = await axios.get(`https://api.github.com/repos/${username}/${repository}`); // TODO: accept header
            data = result.data;
        }

        return {
            id: data.id,
            url: data.html_url,
            name: data.name,
            isPrivate: data.private,
            isFork: data.fork,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
            homepage: data.homepage || undefined,
            stars: data.stargazers_count,
            language: data.language,
            forks: data.forks,
            openIssues: data.open_issues_count,
            license: {
                key: data.license.key,
                name: data.license.name,
                url: data.license.url
            },
            owner: {
                id: data.owner.id,
                username: data.owner.login
            }
        };
    }

    private async fetchRepoDataById(id: number): Promise<any> {
        const { data } = await axios.get(`https://api.github.com/repositories/${id}`);
        return data;
    }

    // private static getContributors() {
    //     // https://api.github.com/repos/angrykoala/wendigo/contributors
    // }
    // private static getIssues() {
    //     // https://api.github.com/repos/angrykoala/wendigo/issues
    // }

    // https://api.github.com/repos/angrykoala/wendigo/contents
}
