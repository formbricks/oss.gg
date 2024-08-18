import { registerHooks, webhookMiddleware } from "@/lib/github";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Set to store processed event IDs
const processedEvents = new Set<string>();

// Flag to ensure hooks are registered only once
let hooksRegistered = false;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const eventId = req.headers["x-github-delivery"] as string;

    if (!eventId) {
      res.status(400).json({ error: "Missing X-GitHub-Delivery header" });
      return;
    }

    if (processedEvents.has(eventId)) {
      console.log(`Event ${eventId} already processed, skipping`);
      res.status(200).end();
      return;
    }

    if (!hooksRegistered) {
      registerHooks();
      hooksRegistered = true;
    }

    webhookMiddleware(req, res, () => {
      processedEvents.add(eventId);

      // Optionally, remove the event ID after some time to prevent the set from growing indefinitely
      setTimeout(
        () => {
          processedEvents.delete(eventId);
        },
        24 * 60 * 60 * 1000
      ); // 24 hours

      res.status(200).end();
    });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
