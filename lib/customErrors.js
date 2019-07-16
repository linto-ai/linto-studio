class componentMissingError extends Error {
    constructor(missingComponents) {
        super()
        this.name = 'COMPONENT_MISSING';
        this.missingComponents = missingComponents
    }
}

module.exports = {
    componentMissingError
}