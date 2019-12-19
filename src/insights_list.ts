import ContributingInsight from "./insights/github_community/contributing_insight";
import CodeOfConductInsight from "./insights/github_community/code_of_conduct_insight";
import IssueTemplateInsight from "./insights/github_community/issue_template_insight";
import PullRequestTemplateInsight from "./insights/github_community/pr_template_insight";
import ReadmeInsight from "./insights/basic/readme_insight";
import ChangelogInsight from './insights/basic/changelog_insight';
import HomepageInsight from "./insights/basic/homepage_insight";
import DescriptionInsight from "./insights/basic/description_insight";
import LicenseInsight from "./insights/basic/license_insight";
import IDEFilesInsight from "./insights/unwanted_files/ide_files_insight";
import CompiledFilesInsight from "./insights/unwanted_files/compiled_files_insight";
import EnvFilesInsight from "./insights/unwanted_files/env_files_insight";
import SystemFilesInsight from "./insights/unwanted_files/system_files_insight";
import DependencyFilesInsight from "./insights/unwanted_files/dependency_files_insight";
import OldPullRequestsInsight from "./insights/pull_requests/old_pull_requests_insight";
import OpenPullRequestsInsight from "./insights/pull_requests/open_pull_requests_insight";
import OpenIssuesInsight from "./insights/issues/open_issues_insight";
import OldIssuesInsight from "./insights/issues/old_issues_insight";
import HelpWantedIssuesInsight from "./insights/issues/help_wanted_issues";
import IssuesWithoutDescriptionInsight from "./insights/issues/issues_without_description_insight";
import LogFilesInsight from "./insights/unwanted_files/log_files";
import CompressedFilesInsight from "./insights/unwanted_files/compressed_files";
import CommitActivity from "./insights/commits/commit_activity";
import CrendetialFilesInsight from "./insights/unwanted_files/credential_files_insight";

const list = [
    ReadmeInsight,
    LicenseInsight,
    DescriptionInsight,
    HomepageInsight,
    OldPullRequestsInsight,
    OpenPullRequestsInsight,
    OpenIssuesInsight,
    OldIssuesInsight,
    IssuesWithoutDescriptionInsight,
    HelpWantedIssuesInsight,
    IDEFilesInsight,
    CompiledFilesInsight,
    EnvFilesInsight,
    DependencyFilesInsight,
    SystemFilesInsight,
    CodeOfConductInsight,
    ContributingInsight,
    IssueTemplateInsight,
    PullRequestTemplateInsight,
    ChangelogInsight,
    CompressedFilesInsight,
    LogFilesInsight,
    CrendetialFilesInsight,
    CommitActivity
];

export default list.map(insightClass => new insightClass());
