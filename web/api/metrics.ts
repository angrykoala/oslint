import { SerializedInsight } from "../types";

export default class MetricsAPI {
    private username: string;
    private project: string;

    constructor(username: string, project: string) {
        this.username = username;
        this.project = project;
    }

    public async getMetrics(): Promise<{metrics: any, insights: Array<SerializedInsight>}> {
        const result = await fetch(`/api/metrics?username=${this.username}&project=${this.project}`);
        if (!result.ok) throw new Error(`Couldn't load ${this.username}/${this.project}`);
        return result.json();
    }
}
