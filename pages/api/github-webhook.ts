import { NextApiRequest, NextApiResponse } from "next"
import { registerListeners, webhookMiddleware } from "@/github"

import "@/github/hooks/issue"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    registerListeners()
    webhookMiddleware(req, res, () => res.status(200).end())
  } else {
    res.setHeader("Allow", "POST")
    res.status(405).end("Method Not Allowed")
  }
}
