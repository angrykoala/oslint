import querystring from 'querystring';
import axios, { AxiosResponse } from 'axios';

interface CommunityInsights {
    codeOfConduct?: string;
    contributing?: string;
    issueTemplate?: string;
    pullRequestTemplate?: string;
    license?: string;
    readme?: string;
    health: number;
}

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
    license?: {
        key: string;
        name: string;
        url: string;
    };
    community: CommunityInsights;
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
    description: string;
}

export interface ContentItem {
    name: string; // duplicate from path?
    path: string;
    type: 'file' | 'dir';
    size: number;
    link: string;
}

export interface GithubCredentials {
    username: string;
    token: string;
}

export class GitHubProvider {
    private credentials: GithubCredentials;
    protected username: string;
    protected repository: string;

    constructor(credentials: GithubCredentials, username: string, repository: string) {
        this.username = username;
        this.repository = repository;
        this.credentials = credentials;
    }

    public async fetchRepoMetrics(): Promise<GitHubRepository> {
        const { data } = await axios.get(this.apiUrl);  // TODO: accept header

        const licenseData = data.license ? {
            key: data.license.key,
            name: data.license.name,
            url: data.license.url
        } : undefined;

        const community = await this.fetchCommunityInsights();

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
            forks: data.forks_count,
            license: licenseData,
            owner: {
                id: data.owner.id,
                username: data.owner.login
            },
            community
        };
    }

    public async fetchContributors(): Promise<Array<RepositoryContributor>> {
        const data = await this.getBatchedRequest(`contributors`);
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
        const data = await this.getBatchedRequest(`issues`, {
            state,
        });
        return data.filter((i: any) => {
            return !i.pull_request;  // Avoid adding PRs
        }).map((issue: any): RepositoryIssue => {
            return {
                number: issue.number,
                state: issue.state,
                title: issue.title,
                comments: issue.comments,
                creator: issue.user.id,
                createdAt: new Date(issue.created_at),
                updatedAt: new Date(issue.updated_at),
                closedAt: issue.closed_at,
                labels: issue.labels.map((l: any) => l.name),
                description: issue.body
            };
        });
    }

    public async fetchContents(): Promise<Array<ContentItem>> {
        const data = await this.getBatchedRequest(`contents`);
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

    private async fetchCommunityInsights(): Promise<CommunityInsights> {
        const { data } = await this.getRequest(`community/profile`);
        return {
            health: data.health_percentage,
            codeOfConduct: this.extractCommunityInsight(data.files.code_of_conduct),
            contributing: this.extractCommunityInsight(data.files.contributing),
            issueTemplate: this.extractCommunityInsight(data.files.issue_template),
            pullRequestTemplate: this.extractCommunityInsight(data.files.pull_request_template),
            license: this.extractCommunityInsight(data.files.license),
            readme: this.extractCommunityInsight(data.files.readme),
        };
    }

    private extractCommunityInsight(insight: { url?: string } | null): string | undefined {
        if (insight && insight.url) return insight.url;
        return undefined;
    }

    protected get apiUrl(): string {
        return `https://api.github.com/repos/${this.username}/${this.repository}`;
    }

    protected getRequest(path: string, qs?: { [s: string]: string | number }): Promise<AxiosResponse> {
        const encodedQs = querystring.encode(qs);
        return axios.get(`${this.apiUrl}/${path}${encodedQs ? "?" + encodedQs : ""}`, {
            headers: {
                Accept: "application/vnd.github.v3+json, application/vnd.github.black-panther-preview+json"
            },
            auth: {
                username: this.credentials.username,
                password: this.credentials.token
            },
        });
    }

    protected async getBatchedRequest(path: string, qs?: { [s: string]: string | number }): Promise<Array<any>> {
        let nextPage = null;
        let page = 1;
        let data: Array<any> = [];
        do {
            const response = await this.getRequest(path, { page: page, per_page: 100, ...qs });
            const linkHeader = this.parseLinkHeader(response);
            nextPage = linkHeader.next;
            page++;
            data = data.concat(response.data);
        } while (Boolean(nextPage));
        return data;
    }

    protected parseLinkHeader(response: AxiosResponse): any {
        const data = response.headers.link;
        if (!data) return {};
        const parsedData: any = {};

        const arrData = data.split(",");

        for (const d of arrData) {
            const linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/ig.exec(d);

            if (linkInfo) parsedData[linkInfo[2]] = linkInfo[1];
        }
        return parsedData;
    }

}
