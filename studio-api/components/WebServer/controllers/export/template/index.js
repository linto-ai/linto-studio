const defaultTemplate = require('./default');
const eu = require('./eu');

module.exports = {
    generate:  (data, template = 'default') => {
        switch (template) {
            case 'eu':
                return eu.create(conversation, metadata, format)
            case 'default':
            default:
                return defaultTemplate.create(data)
        }
    },
    generateEnd : (documentData, template = 'default') => {
        switch (template) {
            case 'eu':
                return eu.createEnd(conversation, metadata, format)
            case 'default':
            default:
                return defaultTemplate.createEnd(documentData)
        }
    }
}
