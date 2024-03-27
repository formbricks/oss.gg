import { getRepositoryById } from "@/lib/repository/service";

import LayoutTabs from "./layoutTabs";

export const metadata = {
  title: "Formbricks",
  description: "Contribute to the worlds fastest growing survey infrastructure.",
};

export default async function RepoDetailPageLayout({ params, children }) {
  const repository = await getRepositoryById(params.repositoryId);
  if (!repository) {
    throw new Error("Repository not found");
  }
  return (
    <>
      <LayoutTabs repository={repository} />
      <main>{children}</main>
    </>
  );
}
