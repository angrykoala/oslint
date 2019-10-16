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
interface RepositoryIssue {
    number: number;
    state: "open" | "closed";
    title: string;
    comments: number;
    creator: number; // user id
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    labels: Array<string>
}
//
// interface RepositoryPR extends RepositoryIssue {
//     mergedAt: Date;
// }
//

export class GitHubProvider {
    protected username: string;
    protected repository: string;

    constructor(username: string, repository: string) {
        this.username = username;
        this.repository = repository;
    }

    public async fetchRepoMetrics(): Promise<GitHubRepository> {
        const { data } = await axios.get(this.apiUrl);  // TODO: accept header

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

    // private async fetchRepoDataById(id: number): Promise<any> {
    //     const { data } = await axios.get(`https://api.github.com/repositories/${id}`);
    //     return data;
    // }

    // private static getContributors() {
    //     // https://api.github.com/repos/angrykoala/wendigo/contributors
    // }
    public async fetchIssues(): Promise<RepositoryIssue> {
        const { data } = await axios.get(`${this.apiUrl}/issues`);  // TODO: accept header
        return data.map((issue: any) => {
            return {
                number: issue.number,
                state: issue.state,
                title: issue.title,
                comments: issue.comments,
                creator: issue.user.id,
                createdAt: issue.created_at,
                updatedAt: issue.updated_at,
                closedAt: issue.closed_at,
                labels: issue.labels.map((l: any) => l.name)
            };
        });
        // https://api.github.com/repos/angrykoala/wendigo/issues
    }

    protected get apiUrl(): string {
        return `https://api.github.com/repos/${this.username}/${this.repository}`;
    }

    // https://api.github.com/repos/angrykoala/wendigo/contents
}
