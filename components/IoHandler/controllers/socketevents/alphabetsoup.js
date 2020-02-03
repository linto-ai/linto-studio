module.exports = function () {
    this.io.on('connection', (socket) => {
        if (this.app.components["AlphabetSoup"]) {
            
            socket.on('alphabetSoupStart', async () => {
                if (socket.request.session.logged === 'on')
                {
                for (let letterPromise of this.app.components["AlphabetSoup"].generatePromisesAlphabetSoup()) {
                    let letter = await letterPromise
                    this.io.emit("letter", letter)
                }} else {
                    this.io.emit("notlogged")
                }
            })
        }
    })
}