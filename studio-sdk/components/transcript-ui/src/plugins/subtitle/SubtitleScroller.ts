import splitPartialSubtitles from "./utils/splitPartialSubtitles"

interface DrawerOptions {
  fontSize?: number
  lineHeight?: number
  color?: string
  font?: string
  paddingInline?: number
}

interface ScrollerState {
  previousText: string
  previousIndexes: number[]
}

export class SubtitleDrawer {
  protected canvas: HTMLCanvasElement
  protected fontSize: number
  protected lineHeight: number
  protected color: string
  protected font: string
  protected paddingInline: number
  protected isResizing = false
  private resizeObserver: ResizeObserver

  constructor(
    canvas: HTMLCanvasElement,
    {
      fontSize = 40,
      lineHeight = 50,
      color = "white",
      font = "Arial",
      paddingInline = 100,
    }: DrawerOptions = {},
  ) {
    this.canvas = canvas
    this.fontSize = fontSize
    this.lineHeight = lineHeight
    this.color = color
    this.font = font
    this.paddingInline = paddingInline

    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight

    this.resizeObserver = new ResizeObserver(() => {
      this.isResizing = true
      this.canvas.width = this.canvas.clientWidth
      this.canvas.height = this.canvas.clientHeight
      this.onResize()
      this.isResizing = false
    })
    this.resizeObserver.observe(this.canvas)
  }

  dispose(): void {
    this.resizeObserver.disconnect()
  }

  resetDrawing(): void {
    const ctx = this.canvas.getContext("2d")!
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  protected drawText(text: string, x: number, y: number): void {
    const ctx = this.canvas.getContext("2d")!
    ctx.font = `${this.fontSize}px ${this.font}`
    ctx.fillStyle = this.color
    ctx.fillText(text, x + this.paddingInline, y)
  }

  protected drawFirstLine(text: string): void {
    this.drawText(text, 0, this.fontSize)
  }

  protected drawSecondLine(text: string): void {
    this.drawText(text, 0, this.fontSize + this.lineHeight)
  }

  protected onResize(): void {
    // Override in subclass
  }
}

export class SubtitleScroller extends SubtitleDrawer {
  private currentState: ScrollerState = { previousText: "", previousIndexes: [] }
  private previousState: ScrollerState = { previousText: "", previousIndexes: [] }

  constructor(canvas: HTMLCanvasElement, options?: DrawerOptions) {
    super(canvas, options)
  }

  resetAll(): void {
    this.currentState = { previousText: "", previousIndexes: [] }
    this.previousState = { previousText: "", previousIndexes: [] }
  }

  protected override onResize(): void {
    const currentText = this.currentState.previousText
    this.resetAll()
    this.currentState = splitPartialSubtitles(
      this.currentState,
      currentText.trim(),
      this.computeIfTextIsTooLong.bind(this),
    )
    this.draw()
  }

  newPartial(text: string): void {
    if (this.isResizing) return
    this.currentState = splitPartialSubtitles(
      this.currentState,
      text.trim(),
      this.computeIfTextIsTooLong.bind(this),
    )
    this.draw()
  }

  newFinal(text: string): void {
    if (this.isResizing) return
    this.currentState = splitPartialSubtitles(
      this.currentState,
      text.trim(),
      this.computeIfTextIsTooLong.bind(this),
    )
    this.draw()
    this.resetState()
  }

  private resetState(): void {
    this.previousState = this.currentState
    this.currentState = { previousText: "", previousIndexes: [] }
  }

  private draw(): void {
    this.resetDrawing()
    let firstLine = ""
    let secondLine = ""

    switch (this.currentState.previousIndexes.length) {
      case 0:
        firstLine = this.getLastLineOfState(this.previousState)
        secondLine = this.currentState.previousText
        break
      default:
        firstLine = this.getSecondLastLineOfState(this.currentState)
        secondLine = this.getLastLineOfState(this.currentState)
        break
    }

    this.drawFirstLine(firstLine)
    this.drawSecondLine(secondLine)
  }

  private getLastLineOfState(state: ScrollerState): string {
    if (state.previousIndexes.length === 0) return state.previousText
    const lastIndex = state.previousIndexes[state.previousIndexes.length - 1]!
    return state.previousText.split(" ").slice(lastIndex).join(" ")
  }

  private getSecondLastLineOfState(state: ScrollerState): string {
    if (state.previousIndexes.length === 0) return ""
    const lastIndex = state.previousIndexes[state.previousIndexes.length - 1]!
    let beforeLastIndex = 0
    if (state.previousIndexes.length > 1) {
      beforeLastIndex = state.previousIndexes[state.previousIndexes.length - 2]!
    }
    return state.previousText.split(" ").slice(beforeLastIndex, lastIndex).join(" ")
  }

  private computeIfTextIsTooLong(text: string): boolean {
    const ctx = this.canvas.getContext("2d")!
    ctx.font = `${this.fontSize}px ${this.font}`
    const maxWidth = this.canvas.width - 2 * this.paddingInline
    const width = ctx.measureText(text).width
    return width > maxWidth
  }
}
