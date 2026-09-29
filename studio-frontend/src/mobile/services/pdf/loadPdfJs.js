// pdf.js is only needed when a report is opened: loaded on first use, then
// reused. The legacy build keeps older iOS Safari versions working.
let pdfJsPromise = null

export function loadPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = Promise.all([
      import("pdfjs-dist/legacy/build/pdf.min.mjs"),
      import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url"),
    ]).then(([pdfjs, worker]) => {
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default
      return pdfjs
    })
    pdfJsPromise.catch(() => {
      pdfJsPromise = null
    })
  }
  return pdfJsPromise
}
