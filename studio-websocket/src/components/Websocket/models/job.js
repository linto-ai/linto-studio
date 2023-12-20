import { getJobs } from "../request/index.js"

export class Job {
  constructor(key, conversationId, updateJobFunction, conversationValue = null) {
    this.key = key
    this.state = "pending"
    this.steps = []
    this.logs = ""
    this.updateJobFunction = updateJobFunction

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
    this.setFromConversation(jobs)
    this.updateJobFunction(this.key, jobs[this.key])
  }

  toJSON() {
    return {
      state: this.state,
      steps: this.steps,
      logs: this.logs
    }
  }
}


export const jobTrapper = {
  get: function (target, prop, receiver) {
    //console.log(target)
    return new Job(prop, target.id, target.setJobs.bind(target), target.obj)
  },
}
