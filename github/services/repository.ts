import { db } from "@/lib/db"

export const selectRepository = async (id: string) => {
  try {
    const selectedRepository = await db.repository.update({
      where: {
        id,
      },
      data: {
        configured: true,
      },
    })
    return selectedRepository
  } catch (error) {
    throw new Error(`Failed to select repository: ${error}`)
  }
}

export const getRepositoriesForUser = async (userId: string) => {
  try {
    const installationIds = await db.membership.findMany({
      where: {
        userId,
      },
    })

    const repos = await db.repository.findMany({
      where: {
        installationId: {
          in: installationIds.map((id) => id.installationId),
        },
        configured: false,
      },
    })
    repos.sort((a, b) => a.name.localeCompare(b.name))
    return repos
  } catch (error) {
    throw new Error(`Failed to get repositories for user: ${error}`)
  }
}
