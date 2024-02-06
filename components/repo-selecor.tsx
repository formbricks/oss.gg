"use client"

import { useToast } from "@/components/ui/use-toast"

export const RepoSelector = ({ repo, selectRepoAction }) => {
  const { toast } = useToast()
  return (
    <div
      className="rounded-md p-3 flex space-x-3 items-center hover:bg-slate-10 hover:scale-102 border border-transparent hover:border-slate-200 transition-all hover:cursor-pointer ease-in-out duration-150"
      onClick={() => {
        selectRepoAction(repo.id)
        toast({
          title: `${repo.name} selected`,
          description: "Next steps to be built",
        })
      }}
    >
      {repo.name}
    </div>
  )
}
