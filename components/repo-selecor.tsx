"use client";

import { useToast } from "@/components/ui/use-toast";

export const RepoSelector = ({ repo, selectRepoAction }) => {
  const { toast } = useToast();
  return (
    <div
      className="hover:bg-slate-10 flex items-center space-x-3 rounded-md border border-transparent p-3 transition-all duration-150 ease-in-out hover:scale-102 hover:cursor-pointer hover:border-slate-200"
      onClick={() => {
        selectRepoAction(repo.id);
        toast({
          title: `${repo.name} selected`,
          description: "Next steps to be built",
        });
      }}>
      {repo.name}
    </div>
  );
};
