class componentMissingError extends Error {
    constructor(missingComponents) {
        super()
        this.name = 'COMPONENT_MISSING';
        this.missingComponents = missingComponents
    }
}

class streamingServerError extends Error {
    constructor(type, msg) {
        super()
        this.name = type;
        this.msg = msg
    }
}

module.exports = {
    componentMissingError,
    streamingServerError
}