// Voice sample enrolment shared by organization labels and user opt-in

const model = require(`${process.cwd()}/lib/mongodb/models`)
const limits = require(`${process.cwd()}/lib/dao/speakerIdentification/limits`)
const { storeAndCreateSample } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { checkSampleHomogeneity } = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/homogeneity`,
)

function checkSampleDuration(audioDuration, existingTotal, ErrorClass) {
  if (audioDuration === undefined) return
  const min = limits.minSampleDuration()
  if (audioDuration < min) {
    throw new ErrorClass(
      `Voice sample too short (${Math.round(audioDuration)}s), at least ${min}s of speech are required`,
    )
  }
  const maxTotal = limits.maxTotalDurationPerLabel()
  if (existingTotal + audioDuration > maxTotal) {
    throw new ErrorClass(
      `Maximum total duration of voice samples per speaker reached (${maxTotal}s)`,
    )
  }
}

// Stores `audioFile` as a sample of `subject` once every rule passes
async function enrolSample({
  audioFile,
  payload,
  subject,
  existingSamples,
  ErrorClass,
}) {
  const maxSamples = limits.maxSamplesPerLabel()
  if (existingSamples.length >= maxSamples) {
    throw new ErrorClass(
      `Maximum number of voice samples per speaker reached (${maxSamples})`,
    )
  }
  const existingTotal =
    model.voiceprints.sampleMetrics(existingSamples).totalDuration

  return storeAndCreateSample(
    audioFile,
    payload,
    model.voiceSamples,
    ErrorClass,
    async (absolutePath, audioDuration) => {
      checkSampleDuration(audioDuration, existingTotal, ErrorClass)
      await checkSampleHomogeneity({ ...subject, absolutePath })
    },
  )
}

module.exports = { enrolSample, checkSampleDuration }
