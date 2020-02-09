import ContributingInsight from "./insights/community/contributing_insight";
import CodeOfConductInsight from "./insights/community/code_of_conduct_insight";
import IssueTemplateInsight from "./insights/community/issue_template_insight";
import PullRequestTemplateInsight from "./insights/community/pr_template_insight";
import OldPullRequestsInsight from "./insights/pull_requests/old_pull_requests_insight";
import OpenPullRequestsInsight from "./insights/pull_requests/open_pull_requests_insight";
import OpenIssuesInsight from "./insights/issues/open_issues_insight";
import OldIssuesInsight from "./insights/issues/old_issues_insight";
import HelpWantedIssuesInsight from "./insights/issues/help_wanted_issues";
import IssuesWithoutDescriptionInsight from "./insights/issues/issues_without_description_insight";
import ReadmeInsight from "./insights/repository/readme_insight";
import LicenseInsight from "./insights/repository/license_insight";
import DescriptionInsight from "./insights/repository/description_insight";
import HomepageInsight from "./insights/repository/homepage_insight";
import IDEFilesInsight from "./insights/repository/unwanted_files/ide_files_insight";
import CompiledFilesInsight from "./insights/repository/unwanted_files/compiled_files_insight";
import DependencyFilesInsight from "./insights/repository/unwanted_files/dependency_files_insight";
import SystemFilesInsight from "./insights/repository/unwanted_files/system_files_insight";
import EnvFilesInsight from "./insights/repository/unwanted_files/env_files_insight";
import ChangelogInsight from "./insights/repository/changelog_insight";
import CompressedFilesInsight from "./insights/repository/unwanted_files/compressed_files";
import LogFilesInsight from "./insights/repository/unwanted_files/log_files";
import CrendetialFilesInsight from "./insights/repository/unwanted_files/credential_files_insight";
import CommitActivity from "./insights/repository/commit_activity";
import BlockedIssuesInsight from "./insights/issues/blocked_issues_insight";
import BugIssuesInsight from "./insights/issues/bugs_issues_insight";

const list = [
    ReadmeInsight,
    LicenseInsight,
    DescriptionInsight,
    HomepageInsight,
    OldPullRequestsInsight,
    OpenPullRequestsInsight,
    OpenIssuesInsight,
    OldIssuesInsight,
    BugIssuesInsight,
    IssuesWithoutDescriptionInsight,
    HelpWantedIssuesInsight,
    IDEFilesInsight,
    CompiledFilesInsight,
    BlockedIssuesInsight,
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
