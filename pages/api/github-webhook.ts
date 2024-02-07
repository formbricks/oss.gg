import { registerHooks, webhookMiddleware } from "@/github";
import "@/github/hooks/issue";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    registerHooks();
    webhookMiddleware(req, res, () => res.status(200).end());
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
