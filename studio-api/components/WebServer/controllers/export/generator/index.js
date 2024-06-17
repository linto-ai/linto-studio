const debug = require('debug')(`linto:conversation-manager:components:WebServer:controllers:export:generator:index`)

const content = require('../content/content');
const template = require('../template/index');

module.exports = {
    generate: (data, query) => {
        let docContent = content.generate(data, query)

        if (docContent.template === 'eu') {
            return template.eu.generate(docContent, data)
        } else {
            return template.default.generate(docContent, data)

        }
    }
}