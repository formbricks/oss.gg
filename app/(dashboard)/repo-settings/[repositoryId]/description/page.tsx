import UpdateProjectDescription from "@/components/ui/updateProjectDescription";
import { fetchRepoDetails, updateRepositoryDescritpion } from "@/lib/repository/service";

export const metadata = {
  title: "Project description",
  description: "Change how your project is presented to players.",
};

export default async function DescriptionPage({ params, useState }) {

  const repoDetail = await fetchRepoDetails(params.repositoryId);

  console.log({ repoDetail })

  async function updateRepoDescritpion(description: string) {
    "use server"
    return updateRepositoryDescritpion(params.repositoryId, description);
  }

  return (
    <div>
      <UpdateProjectDescription action={updateRepoDescritpion} content={repoDetail?.projectDescription}/>
    </div>
  );
}
