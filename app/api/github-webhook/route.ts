import { registerHooks } from "@/lib/github";
import { EmitterWebhookEventName } from "@octokit/webhooks";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Set to store processed event IDs
const processedEvents = new Set<string>();

// Flag to ensure hooks are registered only once
let hooksRegistered = false;

export async function POST(req: Request) {
  const headersList = headers();
  const eventId = headersList.get("x-github-delivery") as string;
  const githubEvent = headersList.get("x-github-event") as string;

  const body = await req.json();

  console.log(JSON.stringify({ eventId, githubEvent, body }, null, 2));

  if (!eventId) {
    return NextResponse.json({ error: "Missing X-GitHub-Delivery header" }, { status: 400 });
  }

  if (processedEvents.has(eventId)) {
    return NextResponse.json({ message: `Event ${eventId} already processed, skipping` }, { status: 200 });
  }

  if (!hooksRegistered) {
    registerHooks(githubEvent as EmitterWebhookEventName, body);
    hooksRegistered = true;
  }

  processedEvents.add(eventId);
  setTimeout(
    () => {
      processedEvents.delete(eventId);
    },
    24 * 60 * 60 * 1000
  ); // 24 hours

  return NextResponse.json({ message: `Event ${eventId} processed` }, { status: 200 });
}
