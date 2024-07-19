import splitPartialSubtitles from "../tools/splitPartialSubtitles"

export class SubtitleDrawer {
  constructor(
    canvas,
    { fontSize = 40, lineHeight = 50, color = "white", font = "Arial" } = {}
  ) {
    this.canvas = canvas

    this.fontSize = fontSize
    this.lineHeight = lineHeight
    this.color = color
    this.font = font
  }

  reset() {
    const ctx = this.canvas.getContext("2d")
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawText(text, x, y) {
    const ctx = this.canvas.getContext("2d")
    ctx.font = `${this.fontSize}px ${this.font}`
    ctx.fillStyle = this.color
    ctx.fillText(text, x, y)
  }

  // those two methods can be refactored into one methods "drawLine(text, lineNumber)"
  drawFirstLine(text) {
    this.drawText(text, 0, this.fontSize)
  }

  drawSecondLine(text) {
    this.drawText(text, 0, this.fontSize + this.lineHeight)
  }
}

export class SubtitleScroller extends SubtitleDrawer {
  constructor(
    canvas,
    { fontSize = 40, lineHeight = 50, color = "white", font = "Arial" } = {}
  ) {
    super(canvas, { fontSize, lineHeight, color, font })

    this.allFinal = ""
    this.currentLine = 0

    this.partialState = { previousText: "", previousIndexes: [] }
  }

  newPartial(text) {
    console.log("----")
    console.log("Partial before", this.partialState)
    this.partialState = splitPartialSubtitles(
      this.partialState,
      this.allFinal + " " + text,
      this.computeIfTextIsTooLong
    )
    console.log("Partial after", this.partialState)

    this.draw()
  }

  draw() {
    this.reset()
    if (this.partialState.previousIndexes.length === 0) {
      return
    }

    if (this.partialState.previousIndexes.length === 1) {
      this.drawFirstLine(this.partialState.previousText)
      return
    }

    const beforeLastIndex =
      this.partialState.previousIndexes[
        this.partialState.previousIndexes.length - 2
      ]
    const lastIndex =
      this.partialState.previousIndexes[
        this.partialState.previousIndexes.length - 1
      ]

    const textFirstLine = this.partialState.previousText
      .split(" ")
      .slice(beforeLastIndex, lastIndex)
      .join(" ")

    const textSecondLine = this.partialState.previousText
      .split(" ")
      .slice(lastIndex)
      .join(" ")

    console.log(textFirstLine)
    console.log(textSecondLine)
    console.log("-----")
    this.drawFirstLine(textFirstLine)
    this.drawSecondLine(textSecondLine)
  }

  newFinal(text) {
    this.allFinal += " " + text
    this.partialState = splitPartialSubtitles(
      this.partialState,
      this.allFinal,
      this.computeIfTextIsTooLong
    )

    this.draw()
  }

  computeIfTextIsTooLong(text) {
    return text.length > 60
  }
}
