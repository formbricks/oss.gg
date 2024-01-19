import { NextApiRequest, NextApiResponse } from "next"
import { createNodeMiddleware, Webhooks } from "@octokit/webhooks"

const webhooks = new Webhooks({
  secret: "mysecret",
})

webhooks.on("issue_comment.created", ({ id, name, payload }) => {
  console.log(`Received an issue_comment event id=${id}, name=${name}`)
  console.log("payload: ", payload)
})

const webhookMiddleware = createNodeMiddleware(webhooks, {
  path: "/api/github-webhook",
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    webhookMiddleware(req, res, () => res.status(200).end())
  } else {
    res.setHeader("Allow", "POST")
    res.status(405).end("Method Not Allowed")
  }
}
