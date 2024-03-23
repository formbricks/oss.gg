"use client";

import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TRepository, ZRepository } from "@/types/repository";
import { useEffect, useState } from "react";

import { getRepositoryDataAction } from "./actions";
import EnrollmentStatusBar from "./enrollmentStatusBar";

export default function RepositoryDetailPage({ params }) {
  const [repository, setRepository] = useState<TRepository | null>(null);

  useEffect(() => {
    const fetchRepositoryData = async () => {
      try {
        const repositoryId = params.repositoryId;
        const repositoryData = await getRepositoryDataAction(repositoryId);
        const validatedData = ZRepository.parse(repositoryData);
        setRepository(validatedData);
      } catch (error) {
        console.error("Failed to fetch repository data:", error);
      }
    };

    fetchRepositoryData();
  }, [params.repositoryId]);

  if (!repository) {
    return <div>Loading repository details...</div>;
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={repository.name} text={repository.description} />
      <EnrollmentStatusBar repositoryId={params.repositoryId} />
      <Tabs defaultValue="project-details" className="w-full">
        <TabsList>
          <TabsTrigger value="project-details">Project Details</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="open-issues">Open Issues</TabsTrigger>
        </TabsList>
        <TabsContent value="project-details">
          {/* Pass repository as prop or use context/provider if deeper nesting is involved */}
          <ProjectDetailsSection projectDescription={repository.projectDescription} />
        </TabsContent>
        <TabsContent value="leaderboard">Coming soon: A new adventure awaits!</TabsContent>
        <TabsContent value="open-issues">Coming soon: A new adventure awaits!</TabsContent>
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
