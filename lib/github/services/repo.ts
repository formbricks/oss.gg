import { GITHUB_APP_ACCESS_TOKEN } from "@/lib/constants";

export const getRepositoryDefaultBranch = async (userName: number, repoName: string) => {
  try {
    const githubHeaders = {
      Authorization: `Bearer ${GITHUB_APP_ACCESS_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    };
    const repo = await fetch(`https://api.github.com/repos/${userName}/${repoName}`, {
      headers: githubHeaders,
    });
    const repoData = await repo.json();
    return repoData.default_branch;
  } catch (error) {
    console.error(`Failed to fetch the repository default branch: ${error}`);
    throw new Error(`Failed to fetch the repository default branch: ${error}`);
  }
};

export const getRepositoryReadme = async (userName: number, repoName: string, branchName: string) => {
  try {
    const readme = await fetch(
      `https://raw.githubusercontent.com/${userName}/${repoName}/${branchName}/README.md`
    );
    const readmeText = await readme.text();
    return readmeText;
  } catch (error) {
    console.error(`Failed to fetch the repository README content: ${error}`);
    throw new Error(`Failed to fetch the repository README content: ${error}`);
  }
};
