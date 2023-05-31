import * as core from '@actions/core'
import { LinearClient } from '@linear/sdk'

async function run(): Promise<void> {
  try {
    const TEAM_NAME = core.getInput('team_name', { required: true })
    const PR_NAME = core.getInput('pr_name', { required: true })
    const API_KEY = core.getInput('key', { required: true })

    const isPrefixed = /^[A-Z]{1,3}-[0-9]{1,}:/.test(PR_NAME)
    if (isPrefixed) {
      core.setOutput('task_id', PR_NAME.split(':')[0])
      return
    }

    const client = new LinearClient({
      apiKey: API_KEY,
    })

    const { nodes: teams } = await client.teams()

    const teamId = teams.find(({ name }) => name === TEAM_NAME)?.id

    if (!teamId) {
      throw new Error(`No team found with name ${TEAM_NAME}`)
    }

    const team = await client.team(teamId)
    const issues = await team.issues()
    const duplicateIssue = issues.nodes.find((issue) => issue.title === PR_NAME)
    if (duplicateIssue) {
      core.setOutput('task_id', duplicateIssue.identifier)
      return
    }

    const res = await client.createIssue({
      teamId,
      title: PR_NAME,
    })

    const issue = await res.issue
    if (!issue) {
      throw new Error('Could not get info from created issue')
    }

    core.setOutput('task_id', issue.identifier)
  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message)
    }
  }
}

run()
