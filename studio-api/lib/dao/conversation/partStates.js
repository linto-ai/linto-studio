const PART_STATES = Object.freeze({
  UPLOADING: "uploading",
  PENDING: "pending",
  DONE: "done",
  ERROR: "error",

  isSettled: (state) =>
    state === PART_STATES.DONE || state === PART_STATES.ERROR,
})

module.exports = PART_STATES
