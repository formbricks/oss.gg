import { registerHooks } from "@/lib/github";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const headersList = headers();
  const eventId = headersList.get("x-github-delivery") as string;
  const githubEvent = headersList.get("x-github-event") as string;

  let body: any;

  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!eventId) {
    return NextResponse.json({ error: "Missing X-GitHub-Delivery header" }, { status: 400 });
  }

  registerHooks(githubEvent, body);

  return NextResponse.json({ message: `Event ${eventId} processed` }, { status: 200 });
}
