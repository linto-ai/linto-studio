import splitPartialSubtitles from "../tools/splitPartialSubtitles"

export class SubtitleDrawer {
  constructor(
    canvas,
    {
      fontSize = 40,
      lineHeight = 50,
      color = "white",
      font = "Arial",
      paddingInline = 100,
      paddingVertical = 20,
    } = {}
  ) {
    this.canvas = canvas

    this.fontSize = fontSize
    this.lineHeight = lineHeight
    this.color = color
    this.font = font
    this.paddingInline = paddingInline
    this.paddingVertical = 0

    // set width canvas equal to the width of the parent element
    this.canvas.width = this.canvas.clientWidth
    // set height canvas equal to the height of the parent element
    this.canvas.height = this.canvas.clientHeight

    this.resizeObserverContainer = new ResizeObserver(
      function (entries) {
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight
      }.bind(this)
    )

    this.resizeObserverContainer.observe(this.canvas)
  }

  reset() {
    const ctx = this.canvas.getContext("2d")
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawText(text, x, y) {
    const ctx = this.canvas.getContext("2d")
    ctx.font = `${this.fontSize}px ${this.font}`
    ctx.fillStyle = this.color
    ctx.fillText(text, x + this.paddingInline, y)
  }

  // those two methods can be refactored into one methods "drawLine(text, lineNumber)"
  drawFirstLine(text) {
    this.drawText(text, 0, this.fontSize + this.paddingVertical)
  }

  drawSecondLine(text) {
    this.drawText(
      text,
      0,
      this.fontSize + this.lineHeight + this.paddingVertical
    )
  }
}

export class SubtitleScroller extends SubtitleDrawer {
  constructor(
    canvas,
    { fontSize = 40, lineHeight = 50, color = "white", font = "Arial" } = {}
  ) {
    super(canvas, { fontSize, lineHeight, color, font })

    this.currentText = ""
    this.currentLine = 0

    this.currentState = { previousText: "", previousIndexes: [] }
    this.previousState = { previousText: "", previousIndexes: [] }
  }

  newPartial(text) {
    const currentText = text
    this.currentState = splitPartialSubtitles(
      this.currentState,
      currentText.trim(),
      this.computeIfTextIsTooLong.bind(this)
    )

    this.draw()
  }

  resetState() {
    this.previousState = this.currentState
    this.currentState = { previousText: "", previousIndexes: [] }
    this.currentText = ""
  }

  draw() {
    this.reset()
    let firstLine = ""
    let secondLine = ""

    switch (this.currentState.previousIndexes.length) {
      case 0:
        firstLine = this._getLastLineOfState(this.previousState)
        secondLine = this.currentState.previousText
        break
      default:
        firstLine = this._getSecondLastLineOfState(this.currentState)
        secondLine = this._getLastLineOfState(this.currentState)
        break
    }

    this.drawFirstLine(firstLine)
    this.drawSecondLine(secondLine)
  }

  _getLastLineOfState(state) {
    if (state.previousIndexes.length === 0) {
      return state.previousText
    }

    const lastIndex = state.previousIndexes[state.previousIndexes.length - 1]

    return state.previousText.split(" ").slice(lastIndex).join(" ")
  }

  _getSecondLastLineOfState(state) {
    if (state.previousIndexes.length === 0) {
      return ""
    }

    const lastIndex = state.previousIndexes[state.previousIndexes.length - 1]
    let beforeLastIndex = 0

    if (state.previousIndexes.length > 1) {
      beforeLastIndex = state.previousIndexes[state.previousIndexes.length - 2]
    }

    return state.previousText
      .split(" ")
      .slice(beforeLastIndex, lastIndex)
      .join(" ")
  }

  newFinal(text) {
    this.currentText = text
    this.currentState = splitPartialSubtitles(
      this.currentState,
      this.currentText.trim(),
      this.computeIfTextIsTooLong.bind(this)
    )
    this.draw()
    this.resetState()
  }

  computeIfTextIsTooLong(text) {
    const ctx = this.canvas.getContext("2d")
    const maxWidth = this.canvas.width - 2 * this.paddingInline
    const width = ctx.measureText(text).width
    return width > maxWidth
  }
}