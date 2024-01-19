// pages/api/repository.js
import { db } from "@/lib/db"

import { isApiKeyValid } from "../auth"

export async function GET(request) {
  if (!isApiKeyValid(request)) return
  const { searchParams } = new URL(request.url)
  const repositoryId = searchParams.get("id")

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

//this route is for teting purpose
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
