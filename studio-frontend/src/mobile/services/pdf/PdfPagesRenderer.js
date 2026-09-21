import { loadPdfJs } from "@/mobile/services/pdf/loadPdfJs.js"
import { computePdfPageSize } from "@/mobile/tools/computePdfPageSize.js"

// Draws every page of a PDF file as a canvas inside a container, one after
// the other. Owns the pdf.js loading task: destroy() stops the rendering and
// frees the worker document.
export class PdfPagesRenderer {
  constructor(file) {
    this.file = file
    this.task = null
    this.destroyed = false
  }

  async render(container, targetWidth) {
    const pdfjs = await loadPdfJs()
    if (this.destroyed) return
    const data = new Uint8Array(await this.file.arrayBuffer())
    this.task = pdfjs.getDocument({ data })
    const pdf = await this.task.promise
    for (let number = 1; number <= pdf.numPages; number++) {
      if (this.destroyed) return
      await this.renderPage(await pdf.getPage(number), container, targetWidth)
    }
  }

  async renderPage(page, container, targetWidth) {
    const base = page.getViewport({ scale: 1 })
    const size = computePdfPageSize({
      pageWidth: base.width,
      pageHeight: base.height,
      targetWidth,
      pixelRatio: window.devicePixelRatio,
    })
    const viewport = page.getViewport({ scale: size.renderScale })
    const canvas = document.createElement("canvas")
    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)
    canvas.style.width = `${size.cssWidth}px`
    canvas.style.height = `${size.cssHeight}px`
    container.appendChild(canvas)
    await page.render({ canvas, viewport }).promise
  }

  destroy() {
    this.destroyed = true
    this.task?.destroy()
    this.task = null
  }
}
