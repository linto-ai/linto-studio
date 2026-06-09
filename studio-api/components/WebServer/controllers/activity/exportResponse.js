const VALID_FORMATS = ["json", "csv", "xls"]

/**
 * Validate the requested export format. Sends a 400 response and returns true
 * when the format is missing or unsupported.
 */
function isInvalidFormat(format, res) {
  if (!format || !VALID_FORMATS.includes(format)) {
    res.status(400).json({
      error: `Invalid format. Must be one of: ${VALID_FORMATS.join(", ")}`,
    })
    return true
  }
  return false
}

/**
 * Serialize `list` to the requested format and stream it as a download.
 * `toRows(list)` produces the flat rows consumed by the CSV/XLSX generators;
 * the JSON format returns the raw list untouched.
 */
async function sendExport(
  res,
  format,
  { filename, list, toRows, generateCsv, generateXlsx },
) {
  switch (format) {
    case "json":
      res.setHeader("Content-Type", "application/json")
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.json"`,
      )
      return res.json(list)

    case "csv": {
      const csvContent = generateCsv(toRows(list))
      res.setHeader("Content-Type", "text/csv; charset=utf-8")
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.csv"`,
      )
      return res.send(csvContent)
    }

    case "xls": {
      const xlsxBuffer = await generateXlsx(toRows(list))
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      )
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.xlsx"`,
      )
      return res.send(Buffer.from(xlsxBuffer))
    }
  }
}

module.exports = {
  VALID_FORMATS,
  isInvalidFormat,
  sendExport,
}
