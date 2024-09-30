import { registerHooks } from "@/lib/github";
import { EmitterWebhookEvent, EmitterWebhookEventName } from "@octokit/webhooks";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const headersList = headers();
  const eventId = headersList.get("x-github-delivery") as string;
  const githubEvent = headersList.get("x-github-event") as string;

  let body: EmitterWebhookEvent<"issue_comment" | "pull_request" | "installation">["payload"];

  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!eventId) {
    return NextResponse.json({ error: "Missing X-GitHub-Delivery header" }, { status: 400 });
  }

  console.log("registerHooks");
  registerHooks(githubEvent as EmitterWebhookEventName, body);

  return NextResponse.json({ message: `Event ${eventId} processed` }, { status: 200 });
}
