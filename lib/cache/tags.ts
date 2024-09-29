export type CacheTags = string[]

export const cacheTags = {
  enrichedProfile: (gitHubUserName: string): CacheTags => {
    return [`enriched_profile_${gitHubUserName}`]
  },
  pointsAndRank: (userId: string): CacheTags => {
    return [`points_and_rank_${userId}`]
  },
  ossggRepos: () => {
    return ["oss_gg_repos"]
  },
  pullRequests: (githubLogin: string) => {
    return [`pull_requests_${githubLogin}`]

  }

}
