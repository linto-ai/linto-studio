import { getJobs } from "../request/index.js"

export class Job {
  constructor(key, conversationId, conversationValue = null) {
    this.key = key
    this.state = "pending"
    this.steps = []
    this.logs = ""

    this.conversationId = conversationId

    if (conversationValue) {
      this.setFromConversation(conversationValue)
    }
  }

  setFromConversation(conversation) {
    const allJobs = conversation.jobs
    if (!allJobs) return

    const job = allJobs[this.key]
    if (!job) return

    this.state = job.state
    this.steps = job.steps
    this.logs = job.job_logs
  }

  async fetchJob(userToken) {
    const jobs = await getJobs(this.conversationId, userToken)
    this.setFromConversation({ jobs })
  }
}
