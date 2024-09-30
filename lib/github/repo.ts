import { GITHUB_APP_ACCESS_TOKEN } from "@/lib/constants";

export const getRepositoryDefaultBranch = async (userName: string, repoName: string) => {
  try {
    const githubHeaders = {
      Authorization: `Bearer ${GITHUB_APP_ACCESS_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    };
    const repoRes = await fetch(`https://api.github.com/repos/${userName}/${repoName}`, {
      headers: githubHeaders,
    });
    const repoData = await repoRes.json();
    return repoData.default_branch;
  } catch (error) {
    console.error(`Failed to fetch the repository default branch: ${error}`);
    throw new Error(`Failed to fetch the repository default branch: ${error}`);
  }
};

export const getRepositoryReadme = async (userName: string, repoName: string, branchName: string) => {
  try {
    const readmeRes = await fetch(
      `https://raw.githubusercontent.com/${userName}/${repoName}/${branchName}/README.md`
    );
    const readmeText = await readmeRes.text();
    return readmeText;
  } catch (error) {
    console.error(`Failed to fetch the repository README content: ${error}`);
    throw new Error(`Failed to fetch the repository README content: ${error}`);
  }
};
