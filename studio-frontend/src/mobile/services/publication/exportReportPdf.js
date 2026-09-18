import { apiExportWithTemplate } from "@/api/publication.js"
import { exportFilename } from "@/tools/llm/exportFilename.js"
import { getTemplateDisplayName } from "@/tools/getTemplateDisplayName.js"

// An AI report rendered as PDF with a publication template, as a File ready
// to show or share. Same export endpoint as the classic publication modal.
// null when the export fails.
export async function exportReportPdf({
  conversationId,
  conversationName,
  jobId,
  template,
  locale,
}) {
  try {
    const blob = await apiExportWithTemplate(conversationId, jobId, "pdf", {
      templateId: template.id,
    })
    if (!blob) return null
    const templateName = getTemplateDisplayName(template, locale)
    const name = `${conversationName} - ${templateName}`
    return new File([blob], exportFilename(name, "pdf"), {
      type: "application/pdf",
    })
  } catch (error) {
    console.error("report export failed", error)
    return null
  }
}
