import { revalidateTag } from "next/cache";

interface RevalidateProps {
  repositoryId?: string;
  userId?: string;

}

export const pointsCache = {
  tags: {
    byRepositoryId: (repositoryId: string, page?: number) => [
      `points-repositories-${repositoryId}`,
      `points-repositories-${repositoryId}-page-${page}`
    ],
    byPointsForPlayerInRepoByRepositoryId: (userId: string, repositoryId: string) => [
      `points-user-${userId}`,
      `points-user-${userId}-repository-${repositoryId}`
    ],
    getPointsAndRankPerRepository: (userId: string, repositoryId: string) => [
      `points-user-${userId}`,
      `points-user-${userId}-repository-${repositoryId}`
    ],
    rankByPlayerId: (userId: string) => [
      `points-user-${userId}-rank`
    ],

  },
  revalidate({ repositoryId, userId }: RevalidateProps): void {
    const tags = new Set<string>()
    if (repositoryId) {
      for (const tag of this.tags.byRepositoryId(repositoryId)) {
        tags.add(tag);
      }
    }
    if (userId) {
      for (const tag of this.tags.rankByPlayerId(userId)) {
        tags.add(tag);
      }
    }
    if (repositoryId && userId) {
      for (const tag of this.tags.byPlayerAndRepositoryId(userId, repositoryId)) {
        tags.add(tag);
      }
      for (const tag of this.tags.getPointsAndRankPerRepository(userId, repositoryId)) {
        tags.add(tag);
      }
    }
    tags.forEach((tag) => revalidateTag(tag))
  },
}
