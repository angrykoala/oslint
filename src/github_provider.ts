import querystring from 'querystring';
import axios, { AxiosResponse } from 'axios';
import OverrideError from './decorators/override_error';

interface CommunityInsights {
    codeOfConduct?: string;
    contributing?: string;
    issueTemplate?: string;
    pullRequestTemplate?: string;
    license?: string;
    readme?: string;
    health: number;
}

export interface ProjectMetrics {
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
    hasWiki: boolean;
    license?: {
        key: string;
        name: string;
        url: string;
    };
    community: CommunityInsights;
    defaultBranch: Branch;
}

export interface Release {
    url: string;
    id: number;
    tag: string;
    name: string;
    publishedAt: Date;
    draft: boolean;
    prerelease: boolean;
    assets: Array<ReleaseAsset>;
}

export interface ReleaseAsset {
    url: string;
    name: string;
    size: number;
    downloads: number;
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
    url: string;
}

export interface PullRequest {
    number: number;
    state: "open" | "closed";
    title: string;
    creator: number; // user id
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    description: string;
    url: string;
}

export interface ContentItem {
    name: string;
    path: string;
    type: 'file' | 'dir';
    size: number;
    link: string;
}

export interface GithubCredentials {
    username: string;
    token: string;
}

export interface Commit {
    sha: string;
    message: string;
    author: string;
    createdAt: Date;
}

export interface Branch {
    name: string;
    protected: boolean;
    lastCommit: Commit;
    url: string;
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

    @OverrideError("GitHubProvider")
    public async fetchRepoMetrics(): Promise<ProjectMetrics> {
        const { data } = await this.getRequest("");

        const licenseData = data.license ? {
            key: data.license.key,
            name: data.license.name,
            url: data.license.url
        } : undefined;

        const community = await this.fetchCommunityInsights();
        const defaultBranch = await this.fetchBranch(data.default_branch);

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
            hasWiki: data.has_wiki,
            license: licenseData,
            owner: {
                id: data.owner.id,
                username: data.owner.login
            },
            community,
            defaultBranch
        };
    }
    @OverrideError("GitHubProvider")
    public async fetchReleasesMetrics(): Promise<Release[]> {
        const data = await this.getBatchedRequest("/releases");
        return data.map((release: any): Release => {

            return {
                url: release.html_url,
                id: release.id,
                tag: release.tag_name,
                name: release.name,
                publishedAt: new Date(release.published_at),
                draft: release.draft,
                prerelease: release.prerelease,
                assets: release.assets.map((asset: any): ReleaseAsset => {
                    return {
                        url: asset.browser_download_url,
                        name: asset.name,
                        size: asset.size,
                        downloads: asset.download_count
                    }
                }),
            }
        })
    }

    public async fetchContributors(): Promise<Array<RepositoryContributor> | undefined> {
        try {
            const data = await this.getBatchedRequest(`/contributors`);
            return data.map((contributor: any): RepositoryContributor => {
                return {
                    username: contributor.login,
                    id: contributor.id,
                    url: contributor.html_url,
                    type: contributor.type,
                    contributions: contributor.contributions
                };
            });
        } catch (err) {
            console.warn(`[${this.username}/${this.repository}] Could not fetch contributors`, err.message);
            return undefined;
        }
    }

    @OverrideError("GitHubProvider")
    public async fetchIssues(state: "open" | "closed" | "all" = "open"): Promise<Array<RepositoryIssue>> {
        const data = await this.getBatchedRequest(`/issues`, {
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
                description: issue.body,
                url: issue.html_url
            };
        });
    }

    @OverrideError("GitHubProvider")
    public async fetchPullRequests(state: "open" | "closed" | "all" = "open"): Promise<Array<PullRequest>> {
        const data = await this.getBatchedRequest(`/pulls`, {
            state,
        });

        return data.map((pr: any): PullRequest => {
            return {
                number: pr.number,
                state: pr.state,
                title: pr.title,
                creator: pr.user.id,
                createdAt: new Date(pr.created_at),
                updatedAt: new Date(pr.updated_at),
                closedAt: pr.closed_at,
                description: pr.body,
                url: pr.html_url
            };
        });
    }

    @OverrideError("GitHubProvider")
    public async fetchContents(): Promise<Array<ContentItem>> {
        const data = await this.getBatchedRequest(`/contents`);
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

    @OverrideError("GitHubProvider")
    public async fetchBranch(name: string): Promise<Branch> {
        const { data } = await this.getRequest(`/branches/${name}`);
        return {
            name: data.name,
            protected: data.protected,
            url: data._links.html,
            lastCommit: {
                sha: data.commit.sha,
                message: data.commit.commit.message,
                author: data.commit.commit.author.name,
                createdAt: new Date(data.commit.commit.author.date),
            }
        };
    }

    @OverrideError("GitHubProvider")
    public async fetchBranches(): Promise<Array<Branch>> {
        const { data } = await this.getRequest(`/branches`);
        const fullBranchesData = await Promise.all(data.map((raw: any) => {
            return this.fetchBranch(raw.name);
        }))

        return fullBranchesData as Array<Branch>;
    }

    private async fetchCommunityInsights(): Promise<CommunityInsights> {
        const { data } = await this.getRequest(`/community/profile`);
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
        return axios.get(`${this.apiUrl}${path}${encodedQs ? "?" + encodedQs : ""}`, {
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
