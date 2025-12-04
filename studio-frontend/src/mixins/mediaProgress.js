import { customDebug } from "@/tools/customDebug.js"

export const mediaProgressMixin = {
  data() {
    return {
      progressDebug: customDebug("vue:debug:mediaProgress"),
    }
  },
  methods: {
    computeStatus(job) {
      console.log(JSON.parse(JSON.stringify(job)))
      if (!job) return "pending"
      if (job.state === "done" || job.state === "error") {
        return job.state
      }
      const steps = job?.steps
      if (steps) {
        switch (true) {
          case steps?.preprocessing?.status === "started" ||
            steps?.preprocessing?.status === "StepState.STARTED":
            return "preprocessing"
          case steps?.transcription?.status === "started" ||
            steps?.transcription?.status === "StepState.STARTED":
            return "transcription"
          case steps?.diarization?.status === "started" ||
            steps?.diarization?.status === "StepState.STARTED":
            return "diarization"
          case steps?.punctuation?.status === "started" ||
            steps?.punctuation?.status === "StepState.STARTED":
            return "punctuation"
          case steps?.postprocessing?.status === "started" ||
            steps?.postprocessing?.status === "StepState.STARTED":
            return "postprocessing"
          default:
            if (job.state === "started") {
              this.progressDebug(
                "Job is started but step is unknown",
                JSON.parse(JSON.stringify(steps)),
              )
              return "pending"
            }
        }
      }
      return job.state ?? "pending" // should be "pending"
    },
  },
  computed: {
    stepKeys() {
      return [
        "preprocessing",
        "transcription",
        "diarization",
        "punctuation",
        "postprocessing",
      ]
    },
    status() {
      const status = this.computeStatus(this.media?.jobs?.transcription)
      return status
    },
    steps() {
      return this.media?.jobs?.transcription?.steps
    },
    jobState() {
      this.media?.jobs?.transcription?.state
    },
    progressTotal() {
      if (!this.steps) return 100
      return (
        Object.values(this.steps).reduce((acc, step) => {
          if (!step.required) return acc
          return acc + 100
        }, 0) || 100
      )
    },
    progressValue() {
      if (!this.steps) return 0
      let res = Object.values(this.steps).reduce((acc, step) => {
        if (step.progress === undefined) return acc
        return acc + step.progress * 100
      }, 0)
      return res
    },
    progress() {
      let progress = (this.progressValue / this.progressTotal) * 100
      return Math.floor(progress * 10) / 10
    },
    // progress with 2 numbers and no decimal
    progressDisplay() {
      const integer = Math.floor(this.progress)
      // if (integer < 10) {
      //   return `0${integer}%`
      // }
      return `${integer}%`
    },
  },
}
