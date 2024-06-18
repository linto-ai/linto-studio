const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:export:generator:index`)

const content = require('../content/transcription');
const template = require('../template/index');

module.exports = {
    generate: async (data, query) => {
        let docContent = content.generate(data, query)

        if (docContent.template === 'eu') {
            return await template.eu.generate(docContent, data, query)
        } else {
            return template.default.generate(docContent)
        }
    }
}