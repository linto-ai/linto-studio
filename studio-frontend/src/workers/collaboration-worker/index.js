const worker = new Worker(
  new URL("./collaborationWorker.js", import.meta.url),
  { type: "module" }
)

export default {
  worker,
}
