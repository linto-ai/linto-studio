module.exports = function () {
    this.on('partial', (transcriberId, transcription) => {
        this.notify(transcriberId, "partial", transcription)
    })
    this.on('final', (transcriberId, transcription) => {
        this.notify(transcriberId, "final", transcription)
    })
}