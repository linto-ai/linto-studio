const debug = require('debug')(`app:alphabetsoup:soup`)
// this is bound to the component
module.exports = function () {
    this.generatePromisesAlphabetSoup = function* () {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'
        for (let letter of alphabet) {
            this.emit(`${this.id}::letter`, letter)
            yield (new Promise((resolve) => {
                setTimeout(() => {
                    resolve(letter)
                }, Math.random() * 100)
            }))
        }
    }
}