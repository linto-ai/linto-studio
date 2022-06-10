export default class Word extends EventTarget {
    constructor(data) {
        super()
        this.turnId = data.turnId
        this.wordId = data.wordId || data.wid
        this.startTime = data.stime || data.startTime
        this.endTime = data.etime || data.endTime
        this.value = data.word || data.value || ''
        this.metadata = []
        this.wordSpan = null
        this.audioCurrentTime = 0
        this.confidence = data.confidence
    }
    render(targetId) {
        // Get target turn HTML block
        if (this.value !== '') {
            let target = document.getElementById(targetId)

            // Create span element for the word
            let span = document.createElement('span')
            span.setAttribute('data-stime', this.startTime)
            span.setAttribute('data-etime', this.endTime)
            span.setAttribute('id', this.wordId)
            span.classList.add('word')
            span.innerHTML = this.value + ' '
            this.wordSpan = span

            // Add word to DOM
            target.append(this.wordSpan)
            this.updatePlayedWord(this.audioCurrentTime)
        }
        return
    }

    // Set "playing" class
    updatePlayedWord(currentTime) {
        this.audioCurrentTime = currentTime
        if (!!this.wordSpan && this.wordSpan.classList.contains('playing') && this.value !== '') {
            if (this.startTime > currentTime || this.endTime < currentTime) {
                this.wordSpan.classList.remove('playing')
            }
        }
        if (this.startTime <= currentTime && this.endTime >= currentTime && this.value !== '') {
            this.wordSpan.classList.add('playing')
        }
    }
}