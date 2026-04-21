const { Paragraph, TextRun, AlignmentType, SectionType, Header } =
  require("docx")

function generateHeader(name) {
  return {
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            text: name,
            alignment: AlignmentType.CENTER,
          }),
        ],
      }),
    },
    children: [],
  }
}

function generateLineBreak() {
  return new Paragraph({
    thematicBreak: true,
  })
}

function createTextRun(text, bold = false) {
  return new TextRun({
    text,
    bold,
  })
}

function textColumn(nbColumn = 2, space = 500) {
  return {
    properties: {
      type: SectionType.CONTINUOUS,
      column: {
        count: nbColumn,
        space: space,
        separate: false,
        equalWidth: true,
      },
    },
  }
}

module.exports = {
  generateHeader,
  generateLineBreak,
  createTextRun,
  textColumn,
}
