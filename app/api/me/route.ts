import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { hashApiKey } from "@/lib/apikey"
import { db } from "@/lib/db"

export async function GET() {
  const headersList = headers()
  const apiKey = headersList.get("x-api-key")
  if (apiKey) {
    const apiKeyData = await db.apiKey.findUnique({
      where: {
        hashedKey: hashApiKey(apiKey),
      },
      select: {
        environment: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            type: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            widgetSetupCompleted: true,
          },
        },
      },
    })
    if (!apiKeyData) {
      return new Response("Not authenticated", {
        status: 401,
      })
    }
    return NextResponse.json(apiKeyData.environment)
  }
}
