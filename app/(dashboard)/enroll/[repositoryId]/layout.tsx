import { getRepositoryById } from "@/lib/repository/service";
import type { Metadata } from "next";

import LayoutTabs from "./layoutTabs";

interface MetadataProps {
  params: { repositoryId: string };
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const repository = await getRepositoryById(params.repositoryId);

  return {
    title: repository?.name || "",
    description: repository?.description || "",
  };
}

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
