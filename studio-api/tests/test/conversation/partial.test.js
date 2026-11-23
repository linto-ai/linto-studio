const {
  newPart,
  openToAppend,
  isAbandoned,
  placePart,
} = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/partial`,
)

function turn(speakerId, words) {
  return {
    speaker_id: speakerId,
    turn_id: `turn-${words[0][0]}`,
    words: words.map(([word, stime, etime]) => ({ word, stime, etime })),
  }
}

describe("openToAppend", () => {
  test("turns the uploaded audio into the first part of the queue", () => {
    const conversation = {
      jobs: { transcription: { job_id: "job-1", state: "pending" } },
      metadata: { audio: { filepath: "audios/first.mp3", duration: 12.5 } },
    }

    openToAppend(conversation)

    const job = conversation.jobs.transcription
    expect(job.partial).toBe(true)
    expect(job.state).toBe("pending")
    expect(job.parts).toHaveLength(1)
    expect(job.parts[0]).toMatchObject({
      job_id: "job-1",
      duration: 12.5,
      state: "pending",
    })
    // Already the audio of the conversation: nothing to join
    expect(job.parts[0].filepath).toBeUndefined()
    // The single job polling must not pick the conversation
    expect(job.job_id).toBeUndefined()
  })
})

describe("isAbandoned", () => {
  test("a part being uploaded is not abandoned", () => {
    expect(isAbandoned(newPart())).toBe(false)
  })

  test("a part still uploading after the timeout is abandoned", () => {
    const part = { ...newPart(), created: "2020-01-01T00:00:00+00:00" }
    expect(isAbandoned(part)).toBe(true)
  })

  test("a dispatched part is never abandoned", () => {
    const part = {
      ...newPart(),
      state: "pending",
      created: "2020-01-01T00:00:00+00:00",
    }
    expect(isAbandoned(part)).toBe(false)
  })
})

describe("placePart", () => {
  test("shifts the words and the new speakers by the offset", () => {
    const part = {
      speakers: [
        { speaker_id: "new-1", speaker_name: "spk1", stime: 0.4, etime: 2 },
      ],
      text: [turn("new-1", [["bonjour", 0.4, 0.9]])],
    }

    const placed = placePart(part, [], 100.1)

    expect(placed.speakers).toEqual([
      { speaker_id: "new-1", speaker_name: "spk1", stime: 100.5, etime: 102.1 },
    ])
    expect(placed.text[0].words[0]).toMatchObject({ stime: 100.5, etime: 101 })
  })

  test("reuses the known speaker of the same name", () => {
    const known = [{ speaker_id: "known-1", speaker_name: "Alice" }]
    const part = {
      speakers: [
        { speaker_id: "new-1", speaker_name: "Alice", stime: 0, etime: 1 },
        { speaker_id: "new-2", speaker_name: "spk2", stime: 1, etime: 2 },
      ],
      text: [
        turn("new-1", [["un", 0, 1]]),
        turn("new-2", [["deux", 1, 2]]),
      ],
    }

    const placed = placePart(part, known, 10)

    expect(placed.speakers.map((speaker) => speaker.speaker_id)).toEqual([
      "new-2",
    ])
    expect(placed.text.map((placedTurn) => placedTurn.speaker_id)).toEqual([
      "known-1",
      "new-2",
    ])
  })

  test("leaves the transcribed part untouched", () => {
    const part = {
      speakers: [
        { speaker_id: "new-1", speaker_name: "spk1", stime: 0, etime: 1 },
      ],
      text: [turn("new-1", [["un", 0, 1]])],
    }

    placePart(part, [], 5)

    expect(part.text[0].words[0].stime).toBe(0)
    expect(part.speakers[0].stime).toBe(0)
  })

  test("a silent part adds nothing", () => {
    expect(placePart({ speakers: [], text: [] }, [], 5)).toEqual({
      speakers: [],
      text: [],
    })
  })
})
