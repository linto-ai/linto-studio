// Placeholders the LLM gateway fills in any DOCX publication template.
// `output` is the only required one: it receives the AI service result.
export const PUBLICATION_PLACEHOLDERS = Object.freeze([
  { name: "output", required: true },
  { name: "conversation_name", required: false },
  { name: "service_name", required: false },
  { name: "organization_name", required: false },
  { name: "job_date", required: false },
  { name: "generated_at", required: false },
])
