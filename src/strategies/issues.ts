import { RepositoryIssue } from "../github_provider";

export function getIssuesByLabels(issues: Array<RepositoryIssue>, labels: Array<string>): number {
    return issues.filter((issue) => {
        const labelsIntersection = issue.labels.filter(x => labels.includes(x));
        return labelsIntersection.length > 0;
    }).length;
}
