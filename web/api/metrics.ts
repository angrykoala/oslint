export default class MetricAPI {
    private username: string;
    private project: string;

    constructor(username: string, project: string) {
        this.username = username;
        this.project = project;
    }

    public async getMetrics(): Promise<any> {
        const result = await fetch(`/api/metrics?username=${this.username}&project=${this.project}`);
        console.log(await result.json());
    }
}
