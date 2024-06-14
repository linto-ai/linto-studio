const cri = require('./cri');
const cra = require('./cra');
const cred = require('./cred');
const resume = require('./resume');
const verbatim = require('./verbatim');

module.exports = {
    generate: (data, query) => {
        console.log(query.format)
        switch (query.format) {
            case 'cri':
                return cri.generate(data, query);
            case 'cra':
                return cra.generate(data, query);
            case 'cred':
                return cred.generate(data, query);
            case 'resume':
                return resume.generate(data, query);
            case 'verbatim':
            default:
                return verbatim.generate(data, query);
        }
    }
}
