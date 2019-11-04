import ContributingInsight from "./insights/github_community/contributing_insight";
import CodeOfConductInsight from "./insights/github_community/code_of_conduct_insight";
import IssueTemplateInsight from "./insights/github_community/issue_template_insight";
import PullRequestTemplateInsight from "./insights/github_community/pr_template_insight";
import ReadmeInsight from "./insights/basic/readme_insight";
import HomepageInsight from "./insights/basic/homepage_insight";
import DescriptionInsight from "./insights/basic/description_insight";
import LicenseInsight from "./insights/basic/license_insight";
import IDEFilesInsight from "./insights/unwanted_files/ide_files_insight";
import CompiledFilesInsight from "./insights/unwanted_files/compiled_files_insight";
import EnvFilesInsight from "./insights/unwanted_files/env_files_insight";
import SystemFilesInsight from "./insights/unwanted_files/system_files_insight";
import DependencyFilesInsight from "./insights/unwanted_files/dependency_files_insight";

const list = [
    ReadmeInsight,
    LicenseInsight,
    DescriptionInsight,
    HomepageInsight,
    // OldPullRequestsInsight,
    // HasOpenPullRequestsInsight,
    // HasOpenIssuesInsight,
    // OldIssuesInsight,
    // IssuesWithoutDescriptionInsight,
    // HelpWantedIssuesInsight,
    IDEFilesInsight,
    CompiledFilesInsight,
    EnvFilesInsight,
    DependencyFilesInsight,
    SystemFilesInsight,
    CodeOfConductInsight,
    ContributingInsight,
    IssueTemplateInsight,
    PullRequestTemplateInsight
];

export default list.map(insightClass => new insightClass());
