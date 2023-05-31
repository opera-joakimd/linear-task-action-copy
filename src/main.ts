import * as core from '@actions/core'
import { LinearClient } from '@linear/sdk'

async function run(): Promise<void> {
  try {
    const TEAM_NAME = core.getInput('team', { required: true })
    const PR_NAME = core.getInput('pr_name', { required: true })
    const API_KEY = core.getInput('key', { required: true })

    const client = new LinearClient({
      apiKey: API_KEY,
    })

    const { nodes: teams } = await client.teams()

    const targetTeam = teams.find(({ name }) => name === 'action-test')?.id

    if (!targetTeam) {
      throw new Error(`No team found with name ${TEAM_NAME}`)
    }

    const res = await client.createIssue({
      teamId: targetTeam,
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
