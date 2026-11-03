import test from "ava"
import { computeSourceNotice } from "../computeSourceNotice.js"

const ALL_TIMINGS = [
  { name: "live", disabled: false },
  { name: "offline", disabled: false },
  { name: "both", disabled: false },
]

function timings(...disabled) {
  return ALL_TIMINGS.map((option) => ({
    ...option,
    disabled: disabled.includes(option.name),
  }))
}

const importRefusal = {
  messages: [{ key: "billing.refusal.import_exhausted" }],
  action: "buy_pack",
}

function notice(params) {
  return computeSourceNotice({
    source: "microphone",
    timingOptions: ALL_TIMINGS,
    refusal: null,
    refusedCapability: undefined,
    isServerRefusal: false,
    isLiveCreditExhausted: false,
    canBuyLivePack: true,
    ...params,
  })
}

function firstKey(result) {
  return result.messages[0].key
}

test("nothing limits the transcription: no notice", (t) => {
  t.is(notice({}), null)
  t.is(notice({ source: "file" }), null)
})

test("a session has no notice, even without any minute", (t) => {
  t.is(notice({ source: "session", refusal: importRefusal }), null)
})

test("recording, live exhausted: offers a live pack and carries on", (t) => {
  const result = notice({
    isLiveCreditExhausted: true,
    timingOptions: timings("live", "both"),
  })
  t.is(firstKey(result), "transcription_create.credit.live_exhausted")
  t.is(result.action, "buy_pack")
  t.is(result.packKind, "live")
  t.false(result.blocksContinue)
})

test("recording, post-recording exhausted: follows the refusal and carries on", (t) => {
  const result = notice({
    refusal: {
      messages: [
        { key: "billing.refusal.import_exhausted" },
        { key: "billing.refusal.contact_admin" },
      ],
      action: "contact_admin",
    },
    refusedCapability: "import.minutes",
    timingOptions: timings("offline", "both"),
  })
  t.deepEqual(result, {
    messages: [
      { key: "transcription_create.credit.post_recording_exhausted" },
      { key: "billing.refusal.contact_admin" },
    ],
    action: "contact_admin",
    packKind: "transcription",
    blocksContinue: false,
  })
})

test("recording, nothing left: one message, any pack, blocked", (t) => {
  const result = notice({
    refusal: importRefusal,
    isLiveCreditExhausted: true,
    timingOptions: timings("live", "offline", "both"),
  })
  t.is(firstKey(result), "transcription_create.credit.both_exhausted")
  t.is(result.action, "buy_pack")
  t.is(result.packKind, null)
  t.true(result.blocksContinue)
})

test("recording, can't buy live minutes: told to ask an admin", (t) => {
  const result = notice({
    isLiveCreditExhausted: true,
    canBuyLivePack: false,
    timingOptions: timings("live", "both"),
  })
  t.deepEqual(result.messages, [
    { key: "transcription_create.credit.live_exhausted" },
    { key: "billing.refusal.contact_admin" },
  ])
  t.is(result.action, null)
})

test("file, no minute left: the refusal blocks", (t) => {
  const result = notice({
    source: "file",
    refusal: importRefusal,
    refusedCapability: "import.minutes",
  })
  t.is(firstKey(result), "billing.refusal.import_exhausted")
  t.is(result.packKind, "transcription")
  t.true(result.blocksContinue)
})

test("files longer than what is left: says it, keeps the rest of the refusal", (t) => {
  const result = notice({
    source: "file",
    refusal: {
      messages: [
        { key: "billing.refusal.import_too_long" },
        { key: "billing.refusal.contact_admin" },
      ],
      action: "contact_admin",
    },
    refusedCapability: "import.minutes",
    filesOverCredit: {
      count: 3,
      minutes: 130,
      isPartial: false,
      remaining: 90,
    },
  })
  t.deepEqual(result.messages, [
    {
      key: "transcription_create.credit.files_over_credit",
      params: { count: 3, duration: "2 h 10 min", remaining: "1 h 30 min" },
    },
    { key: "billing.refusal.contact_admin" },
  ])
  t.true(result.blocksContinue)
})

test("the message follows the number of files and what is known", (t) => {
  function keyFor(count, isPartial) {
    return firstKey(
      notice({
        source: "file",
        refusal: importRefusal,
        filesOverCredit: { count, minutes: 130, isPartial, remaining: 90 },
      }),
    )
  }
  t.is(keyFor(1, false), "transcription_create.credit.file_over_credit")
  t.is(keyFor(2, false), "transcription_create.credit.files_over_credit")
  t.is(keyFor(2, true), "transcription_create.credit.files_over_credit_partial")
})

test("a file ignores the live minutes", (t) => {
  t.is(notice({ source: "file", isLiveCreditExhausted: true }), null)
})

test("server refusal: shown as is and blocks, for any source", (t) => {
  const refusal = {
    messages: [{ key: "billing.refusal.live_credit" }],
    action: "buy_pack",
  }
  const result = notice({
    refusal,
    refusedCapability: "live.minutes",
    isServerRefusal: true,
  })
  t.is(firstKey(result), "billing.refusal.live_credit")
  t.is(result.packKind, "live")
  t.true(result.blocksContinue)
})

test("no engine at this security level: blocked, nothing to buy", (t) => {
  const result = notice({ timingOptions: timings("live", "offline", "both") })
  t.is(firstKey(result), "conversation.transcription.no_model_for_level")
  t.is(result.action, null)
  t.true(result.blocksContinue)
  t.true(
    notice({ source: "file", timingOptions: timings("offline", "both") })
      .blocksContinue,
  )
})

test("no profile without credit issue: says it, carries on", (t) => {
  const result = notice({ timingOptions: timings("live", "both") })
  t.is(firstKey(result), "transcription_create.credit.live_unavailable")
  t.false(result.blocksContinue)
})
