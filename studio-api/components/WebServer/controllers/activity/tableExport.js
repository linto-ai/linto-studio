const ExcelJS = require("exceljs")

/**
 * Generate CSV content from rows using a column definition.
 * Each column is { key, header, width? }. The header row uses the column keys
 * (machine-friendly), matching the existing KPI session export convention.
 */
function generateCsv(rows, columns) {
  const keys = columns.map((col) => col.key)

  const escape = (val) => {
    if (val === null || val === undefined) return ""
    if (
      typeof val === "string" &&
      (val.includes(",") ||
        val.includes(";") ||
        val.includes('"') ||
        val.includes("\n"))
    ) {
      return `"${val.replace(/"/g, '""')}"`
    }
    return val
  }

  const csvRows = rows.map((row) =>
    keys.map((key) => escape(row[key])).join(","),
  )

  // UTF-8 BOM for Excel compatibility
  const BOM = "﻿"
  return BOM + keys.join(",") + "\n" + csvRows.join("\n")
}

/**
 * Generate an Excel workbook from rows using a column definition.
 * Each column is { key, header, width? }. The header row uses the human
 * readable headers.
 */
async function generateXlsx(rows, columns, sheetName = "Export") {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || 20,
  }))

  // Bold header row
  worksheet.getRow(1).font = { bold: true }

  rows.forEach((row) => worksheet.addRow(row))

  return workbook.xlsx.writeBuffer()
}

module.exports = {
  generateCsv,
  generateXlsx,
}
