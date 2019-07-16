const debug = require('debug')(`app:alphabetsoup:events`)
// this is bound to the component
module.exports = function () {
    this.on(`${this.id}::letter`, (letter) => {
        debug(letter)
    })
}