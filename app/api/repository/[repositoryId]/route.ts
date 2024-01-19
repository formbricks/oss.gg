// pages/api/repository.js
import { db } from "@/lib/db"

import { validateApiKey } from "../../auth"

export async function GET(request, { params }) {
  const repositoryId = params.repositoryId
  const apiKeyData = await validateApiKey(request)
  if (!apiKeyData || repositoryId === apiKeyData.repositoryId) return

  if (!repositoryId) {
    return new Response("Repository ID is required", { status: 400 })
  }

  const repository = await db.repository.findUnique({
    where: { id: repositoryId },
  })

  if (!repository) {
    return new Response("Repository not found", { status: 404 })
  }

  return new Response(JSON.stringify(repository), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  })
}

export async function POST(request) {
  const data = await request.json()

  try {
    const newRepository = await db.repository.create({
      data: {
        githubId: data.githubId,
        name: data.name,
        description: data.description,
        homepage: data.homepage,
        topics: data.topics,
        default_branch: data.default_branch,
        installationId: data.installationId,
        levels: data.levels,
      },
    })

    return new Response(JSON.stringify(newRepository), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
}
