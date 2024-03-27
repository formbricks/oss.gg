import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import GitHubIssue from "@/components/ui/githubIssue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { getAllOssGgIssuesOfRepo } from "@/lib/github/service";
import { getPointsOfUsersInRepoByRepositoryId } from "@/lib/points/service";
import { getRepositoryById } from "@/lib/repository/service";
import { TRepository } from "@/types/repository";

import EnrollmentStatusBar from "./enrollmentStatusBar";
import LeaderBoard from "./leaderBoard";

export default async function RepositoryDetailPage({ params }) {
  const repository = await getRepositoryById(params.repositoryId);
  if (!repository) {
    throw new Error("Repository not found");
  }
  const openIssues = await getAllOssGgIssuesOfRepo(repository.githubId);
  const leaderboardProfiles = await getPointsOfUsersInRepoByRepositoryId(repository.id, 1);

  return (
    <DashboardShell>
      <DashboardHeader heading={repository?.name} text={repository?.description} />
      <EnrollmentStatusBar repositoryId={params.repositoryId} />
      <Tabs defaultValue="project-details" className="w-full">
        <TabsList>
          <TabsTrigger value="project-details">Project Details</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="open-issues">Open Issues</TabsTrigger>
        </TabsList>
        <TabsContent value="project-details">
          {/* Pass repository as prop or use context/provider if deeper nesting is involved */}
          <ProjectDetailsSection projectDescription={repository?.projectDescription} />
        </TabsContent>
        <TabsContent value="leaderboard">
          <LeaderBoard
            leaderboardProfiles={leaderboardProfiles}
            repositoryId={repository.id}
            itemPerPage={ITEMS_PER_PAGE}
          />
        </TabsContent>
        <TabsContent value="open-issues">
          <OpenIssuesSection openIssues={openIssues} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

interface ProjectDetailsSectionProps {
  projectDescription: TRepository["projectDescription"];
}

function ProjectDetailsSection({ projectDescription }: ProjectDetailsSectionProps) {
  return (
    <>
      <p>{projectDescription}</p>
    </>
  );
}

function OpenIssuesSection({ openIssues }) {
  return (
    <div className="space-y-2">
      {openIssues.length === 0 ? (
        <p>Currently, there are no open oss.gg issues available.</p>
      ) : (
        openIssues.map((issue) => <GitHubIssue issue={issue} key={issue.title} />)
      )}
    </div>
  );
}
