import UpdateProjectDescription from "@/components/ui/updateProjectDescription";
import { updateRepositoryDescritpion } from "@/lib/repository/service";


export const metadata = {
  title: "Project description",
  description: "Change how your project is presented to players.",
};



export default async function DescriptionPage({ params, useState }) {

  async function updateRepoDescritpion(description: string) {
    "use server"
    return updateRepositoryDescritpion(params.repositoryId, description);
  }

  return (
    <div>
      <UpdateProjectDescription action={updateRepoDescritpion} repositoryId={params.repositoryId} />
    </div>
  );
}
