export default class AudioPlayer extends EventTarget {
    constructor(data) {
        super()
        this.audioFile = data.audio.filepath
        this.duration = data.audio.duration
        this.player = null
        this.audioState = 'pause'
        this.playerWrapperId = data.playerWrapperId

        // Player elements
        this.playBtn = null
        this.timeline = null
        this.timer = null


        this.initAudioPlayer()
    }
    initAudioPlayer() {
        this.player = new Audio(`${window.location.origin}/${this.audioFile}`)
        this.render()
    }
    render() {
        // Player wrapper
        let audioWrapper = document.getElementById(this.playerWrapperId)

        // Play button
        this.playBtn = document.createElement('button')
        this.playBtn.setAttribute('id', 'audio-player-play')

        //Timeline
        this.timeline = document.createElement('input')
        this.timeline.setAttribute('id', 'audio-player-timeline')
        this.timeline.setAttribute('type', 'range')
        this.timeline.value = 0

        // Timer
        this.timer = document.createElement('div')
        this.timer.setAttribute('id', 'audio-player-timer')
        this.timer.innerHTML = timeToHMS(this.player.currentTime) + ' / ' + timeToHMS(this.duration)

        audioWrapper.append(this.playBtn)
        audioWrapper.append(this.timeline)
        audioWrapper.append(this.timer)

        this.handleEvents()

    }
    handleEvents() {
        // Play / Pause button
        this.playBtn.onclick = () => {
            if (this.audioState === 'pause') {
                this.player.play()
                this.playBtn.classList.add('playing')
                this.playBtn.classList.remove('pause')
            } else if (this.audioState === 'playing') {
                this.player.pause()
                this.playBtn.classList.remove('playing')
                this.playBtn.classList.add('pause')
            }
        }

        // Timeline
        this.timeline.onclick = (e) => {
            let targetTime = this.duration * (parseInt(this.timeline.value) / 100)
            this.setCurrentTime(targetTime)
        }
        this.timeline.oninput = (e) => {
            let targetTime = this.duration * (parseInt(this.timeline.value) / 100)
            this.setCurrentTime(targetTime)
        }
    }

    setCurrentTime(time) {
        this.player.currentTime = time
    }
    updateTimeline(time) {
        this.timeline.value = time * 100 / this.duration
        this.timer.innerHTML = timeToHMS(time) + ' / ' + timeToHMS(this.duration)
    }
}

function timeToHMS(time) {
    const hour = Math.floor(time / (60 * 60))
    const min = Math.floor(time / 60)
    const sec = Math.floor(time % 60)
    return `${hour < 10  ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec }`
}