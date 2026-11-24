const { v4: uuidv4 } = require("uuid")
const moment = require("moment")

const PART_STATES = require(`${process.cwd()}/lib/dao/conversation/partStates`)

// A request that died before dispatching its job would hold the next parts
const UPLOAD_TIMEOUT_MS = 30 * 60 * 1000
// Without a new audio for that long, nobody is expected to complete it
const APPEND_TIMEOUT_MS = 24 * 60 * 60 * 1000

function newPart() {
  return {
    id: uuidv4(),
    state: PART_STATES.UPLOADING,
    created: moment().format(),
  }
}

// The uploaded audio is the first part, the appended ones queue behind it.
// A part holds a filepath until it is joined to the audio of the conversation.
function openToAppend(conversation) {
  const job = conversation.jobs.transcription

  job.partial = true
  job.parts = [
    {
      id: uuidv4(),
      job_id: job.job_id,
      duration: conversation.metadata.audio.duration,
      state: PART_STATES.PENDING,
    },
  ]
  // The jobs are in the parts: no single job left for the regular polling
  delete job.job_id
}

function isAbandoned(part) {
  return (
    part.state === PART_STATES.UPLOADING &&
    moment().diff(moment(part.created)) > UPLOAD_TIMEOUT_MS
  )
}

// Still open long after its last audio. The first part has no date of its own:
// it came with the conversation.
function isLeftOpen(conversation) {
  const job = conversation.jobs.transcription
  if (!job.partial) return false

  const lastPart = job.parts[job.parts.length - 1]
  const lastAudio = lastPart?.created || conversation.created
  return moment().diff(moment(lastAudio)) > APPEND_TIMEOUT_MS
}

// Rounded so that the sum carries no floating point noise
function shiftTime(time, offset) {
  return Math.round((time + offset) * 1e6) / 1e6
}

// A part is diarized on its own: its speakers are matched by name with the
// known ones. Times are shifted to the position of the part in the whole audio.
function placePart(part, knownSpeakers, offset) {
  const speakerIds = {}
  const speakers = []
  for (const speaker of part.speakers) {
    const known = knownSpeakers.find(
      (knownSpeaker) => knownSpeaker.speaker_name === speaker.speaker_name,
    )
    if (known) {
      speakerIds[speaker.speaker_id] = known.speaker_id
    } else {
      speakerIds[speaker.speaker_id] = speaker.speaker_id
      speakers.push({
        ...speaker,
        stime: shiftTime(speaker.stime, offset),
        etime: shiftTime(speaker.etime, offset),
      })
    }
  }

  const text = part.text.map((turn) => ({
    ...turn,
    speaker_id: speakerIds[turn.speaker_id],
    words: turn.words.map((word) => ({
      ...word,
      stime: shiftTime(word.stime, offset),
      etime: shiftTime(word.etime, offset),
    })),
  }))

  return { speakers, text }
}

module.exports = {
  newPart,
  openToAppend,
  isAbandoned,
  isLeftOpen,
  placePart,
}
