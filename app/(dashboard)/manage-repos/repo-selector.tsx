"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TRepository } from "@/types/repository";
import { useCallback, useEffect, useState } from "react";

import { activateRepoAction, deactivateRepoAction, fetchRepoDetailsAction } from "./actions";

interface RepoSelectorProps {
  repo: TRepository;
  userId: string;
}

export const RepoSelector: React.FC<RepoSelectorProps> = ({ repo: initialRepo, userId }) => {
  const { toast } = useToast();
  const [repo, setRepo] = useState<TRepository>(initialRepo);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRepoDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedRepo = await fetchRepoDetailsAction(repo.id);
      if (updatedRepo !== null) {
        setRepo(updatedRepo);
      } else {
        throw new Error("Repository not found or error fetching repository details.");
      }
    } catch (error) {
      console.error("Failed to fetch repository details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch repository details.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [repo.id, toast]);

  useEffect(() => {
    fetchRepoDetails();
  }, [fetchRepoDetails]);

  const handleActivation = useCallback(async () => {
    setIsLoading(true);
    try {
      if (repo.configured) {
        await deactivateRepoAction(repo.id, userId);
        toast({
          title: `${repo.name} deactivated`,
          description: "Players cannot play anymore ❌",
        });
      } else {
        await activateRepoAction(repo.id, userId);
        toast({
          title: `${repo.name} activated`,
          description: "Players can sign up to play now ✅",
        });
      }
      await fetchRepoDetails();
    } catch (error) {
      console.error("Error changing repository activation status", error);
      toast({
        title: "Error",
        description: `Failed to change repository activation status: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [repo, toast, fetchRepoDetails]);

  return (
    <div className="flex items-center justify-between space-x-3 rounded-md border bg-muted p-3">
      <span>{repo.name}</span>
      <Button
        onClick={handleActivation}
        loading={isLoading}
        className={repo.configured ? "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900" : ""}>
        {repo.configured ? "Deactivate Repository" : "Activate Repository"}
      </Button>
    </div>
  );
};
