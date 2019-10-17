import axios from 'axios';

export interface GitHubRepository {
    id: number;
    name: string;
    description?: string;
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

export interface RepositoryContributor {
    username: string;
    id: number;
    url: string;
    type: 'Bot' | 'User';
    contributions: number;
}

export interface RepositoryIssue {
    number: number;
    state: "open" | "closed";
    title: string;
    comments: number;
    creator: number; // user id
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    labels: Array<string>;
}

export interface ContentItem {
    name: string; // duplicate from path?
    path: string;
    type: 'file' | 'dir';
    size: number;
    link: string;
}

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
            description: data.description,
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

    public async fetchContributors(): Promise<Array<RepositoryContributor>> {
        const { data } = await axios.get(`${this.apiUrl}/contributors`);  // TODO: accept header
        return data.map((contributor: any): RepositoryContributor => {
            return {
                username: contributor.login,
                id: contributor.id,
                url: contributor.html_url,
                type: contributor.type,
                contributions: contributor.contributions
            };
        });
    }

    public async fetchIssues(state: "open" | "closed" | "all" = "open"): Promise<Array<RepositoryIssue>> {
        const response = await axios.get(`${this.apiUrl}/issues?state=${state}`);  // TODO: accept header
        // console.log(response.headers.link); // todo: pagination
        return response.data.map((issue: any): RepositoryIssue => {
            return {
                number: issue.number,
                state: issue.state,
                title: issue.title,
                comments: issue.comments,
                creator: issue.user.id,
                createdAt: new Date(issue.created_at),
                updatedAt: new Date(issue.updated_at),
                closedAt: issue.closed_at,
                labels: issue.labels.map((l: any) => l.name)
            };
        });
    }

    public async fetchContents(): Promise<Array<ContentItem>> {
        const { data } = await axios.get(`${this.apiUrl}/contents`);  // TODO: accept header
        return data.map((item: any): ContentItem => {
            return {
                name: item.name,
                path: item.path,
                type: item.type,
                size: item.size,
                link: item._links.self
            };
        });
    }

    protected get apiUrl(): string {
        return `https://api.github.com/repos/${this.username}/${this.repository}`;
    }

}
