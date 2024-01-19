import { readFileSync } from "fs"
import path from "path"
import { Webhooks } from "@octokit/webhooks"

import {
  ASSIGN_IDENTIFIER,
  EVENT_TRIGGERS,
  LEVEL_LABEL,
  UNASSIGN_IDENTIFIER,
} from "../constants"
import { getOctokitInstance } from "../utils"

export const onIssueOpened = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_OPENED, async (context) => {
    const projectId = context.payload.repository.id

    // const isProjectRegistered = await getProject(projectId)
    // if (!isProjectRegistered) {
    //   await context.octokit.issues.createComment(
    //     context.issue({
    //       body: ON_REPO_NOT_REGISTERED,
    //     })
    //   )
    //   return
    // }

    const labels = context.payload.issue.labels?.map((label) => label.name)
    const isLevelLabel = labels?.includes(LEVEL_LABEL)

    if (!isLevelLabel) {
      return
    }

    // await sendNewIssue(
    //   context.payload.repository.id,
    //   context.payload.issue.user.id,
    //   context.payload.issue.id
    // )

    // await context.octokit.issues.createComment(
    //   context.issue({
    //     body: ON_NEW_ISSUE,
    //   })
    // )
  })
}

export const onAssignCommented = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_COMMENTED, async (context) => {
    try {
      const octokit = getOctokitInstance(context.payload.installation?.id!)

      const issueNumber = context.payload.issue.number
      const repo = context.payload.repository.name
      const issueCommentBody = context.payload.comment.body

      if (issueCommentBody === ASSIGN_IDENTIFIER) {
        await octokit.issues.createComment({
          body: "ok brother",
          issue_number: issueNumber,
          repo,
          owner: "formbricks",
        })
      }
    } catch (err) {
      console.log(err)
    }
  })
}

export const onUnassignCommented = async (webhooks: Webhooks) => {
  webhooks.on(EVENT_TRIGGERS.ISSUE_COMMENTED, async (context) => {
    try {
      const octokit = getOctokitInstance(context.payload.installation?.id!)

      const issueNumber = context.payload.issue.number
      const repo = context.payload.repository.name
      const issueCommentBody = context.payload.comment.body

      if (issueCommentBody === UNASSIGN_IDENTIFIER) {
        await octokit.issues.createComment({
          body: "no brother",
          issue_number: issueNumber,
          repo,
          owner: "formbricks",
        })
      }
    } catch (err) {
      console.log(err)
    }
  })
}
