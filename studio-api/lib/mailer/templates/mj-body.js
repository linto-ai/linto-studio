const debug = require("debug")("linto:lib:mailer:templates:mj-body")

const Handlebars = require("handlebars")
const lang = {
  fr: require("./../lang/french.json"),
  en: require("./../lang/english.json"),
}

const templates = require("../lang/templates")

module.exports = function (Type, payload) {
  const mailContent = generateHtml(Type.action, payload)

  const body = `
    <mj-section background-color="#ffffff" padding="10px 25px">
      <mj-column>
        ${mailContent.html}
      </mj-column>
    </mj-section>
  `

  let title = process.env.APPLICATION_NAME || "LinTO Studio"
  if (mailContent.title) {
    title = title + " - " + mailContent.title
  }

  return {
    title,
    body,
  }
}

function renderTemplate(template, payload) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => payload[key] || "")
}

function generateHtml(keyTemplate, payload) {
  const langSelect = "fr"
  const compiledTemplate = Handlebars.compile(templates[keyTemplate])
  const resultHtml = compiledTemplate({ ...lang[langSelect], ...payload }) // interpolates both $t() and {{...}}
  let renderHtml = renderTemplate(resultHtml, payload)

  // Special template require a generation list
  if (keyTemplate === "share_multiple_conversation_right") {
    renderHtml += `
    <mj-text>
      <ul>`
    for (let conv_id of payload.conversationsList)
      renderHtml += `<li><p style="margin:0;"><a href="${payload.origin}/interface/conversations/${conv_id}" target="_blank">${payload.origin}/interface/conversations/${conv_id}</a></p></li>`
    renderHtml += `
      </ul>
    </mj-text>
    `
  }
  return {
    html: renderHtml,
    title: lang[langSelect][keyTemplate].title,
  }
}
